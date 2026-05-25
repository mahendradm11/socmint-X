"""Stylometric fingerprinting — bigrams, vocabulary, punctuation habits."""

import math
import re
from collections import Counter

import numpy as np

WORD_RE = re.compile(r"[\w']+", re.UNICODE)
SENTENCE_SPLIT = re.compile(r"[.!?]+")
KANNADA_RANGE = re.compile(r"[\u0C80-\u0CFF]+")


def _tokenize(text: str) -> list[str]:
    return [t.lower() for t in WORD_RE.findall(text) if len(t) > 1]


def _bigrams(tokens: list[str]) -> Counter:
    if len(tokens) < 2:
        return Counter()
    return Counter(zip(tokens, tokens[1:]))


def _type_token_ratio(tokens: list[str]) -> float:
    if not tokens:
        return 0.0
    return len(set(tokens)) / len(tokens)


def _avg_sentence_length(text: str) -> float:
    sentences = [s.strip() for s in SENTENCE_SPLIT.split(text) if s.strip()]
    if not sentences:
        return float(len(text.split()))
    return sum(len(s.split()) for s in sentences) / len(sentences)


def extract_stylometry(texts: list[str]) -> dict:
    combined = "\n".join(texts)
    tokens = _tokenize(combined)
    bigram_counts = _bigrams(tokens)
    top_bigrams = dict(bigram_counts.most_common(40))

    punct = Counter(c for c in combined if c in ".,!?;:\"'()-")
    total_chars = max(len(combined), 1)
    kannada_chars = len(KANNADA_RANGE.findall(combined))

    return {
        "token_count": len(tokens),
        "unique_tokens": len(set(tokens)),
        "type_token_ratio": round(_type_token_ratio(tokens), 4),
        "avg_sentence_length": round(_avg_sentence_length(combined), 2),
        "avg_word_length": round(
            sum(len(t) for t in tokens) / max(len(tokens), 1), 2
        ),
        "exclamation_rate": round(punct.get("!", 0) / total_chars, 5),
        "question_rate": round(punct.get("?", 0) / total_chars, 5),
        "ellipsis_rate": round(combined.count("...") / max(len(texts), 1), 4),
        "kannada_script_ratio": round(kannada_chars / total_chars, 4),
        "top_bigrams": {f"{a} {b}": c for (a, b), c in top_bigrams.items()},
        "top_unigrams": dict(Counter(tokens).most_common(30)),
    }


def _vectorize_stylometry(profile: dict) -> dict[str, float]:
    vec = {
        "ttr": profile["type_token_ratio"],
        "asl": profile["avg_sentence_length"] / 50.0,
        "awl": profile["avg_word_length"] / 10.0,
        "excl": profile["exclamation_rate"] * 100,
        "ques": profile["question_rate"] * 100,
        "kan": profile["kannada_script_ratio"],
    }
    for bg, count in profile.get("top_bigrams", {}).items():
        vec[f"bg:{bg}"] = math.log1p(count)
    return vec


def stylometric_similarity(profile_a: dict, profile_b: dict) -> tuple[float, str]:
    va = _vectorize_stylometry(profile_a)
    vb = _vectorize_stylometry(profile_b)
    keys = set(va) | set(vb)
    if not keys:
        return 0.0, "Insufficient text for stylometric comparison."

    a_arr = np.array([va.get(k, 0.0) for k in keys])
    b_arr = np.array([vb.get(k, 0.0) for k in keys])
    denom = np.linalg.norm(a_arr) * np.linalg.norm(b_arr)
    if denom == 0:
        return 0.0, "Zero-variance stylometric vectors."

    cosine = float(np.dot(a_arr, b_arr) / denom)
    score = max(0.0, min(1.0, cosine))

    shared_bigrams = set(profile_a.get("top_bigrams", {})) & set(
        profile_b.get("top_bigrams", {})
    )
    evidence = (
        f"Stylometric cosine similarity {score:.0%}; "
        f"TTR {profile_a['type_token_ratio']:.2f} vs {profile_b['type_token_ratio']:.2f}; "
        f"{len(shared_bigrams)} shared top bigrams."
    )
    return score, evidence
