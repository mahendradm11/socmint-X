import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.services.behavioral.stylometry import extract_stylometry, stylometric_similarity
from app.services.behavioral.temporal import extract_temporal, temporal_overlap_similarity


def _nlp_similarity(texts_a: list[str], texts_b: list[str]) -> tuple[float, str]:
    corpus = texts_a + texts_b
    if len(corpus) < 2:
        return 0.0, "Insufficient text for NLP similarity."

    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        min_df=1,
        stop_words="english",
    )
    try:
        matrix = vectorizer.fit_transform(corpus)
    except ValueError:
        return 0.0, "Could not vectorize text corpus."

    split = len(texts_a)
    vec_a = np.asarray(matrix[:split].mean(axis=0)).reshape(1, -1)
    vec_b = np.asarray(matrix[split:].mean(axis=0)).reshape(1, -1)
    score = float(cosine_similarity(vec_a, vec_b)[0][0])
    score = max(0.0, min(1.0, score))

    evidence = f"TF-IDF semantic similarity across {len(texts_a)} vs {len(texts_b)} posts: {score:.0%}."
    return score, evidence


def build_fingerprint(posts: list[dict]) -> dict:
    texts = [p["text"] for p in posts]
    return {
        "stylometry": extract_stylometry(texts),
        "temporal": extract_temporal(posts),
        "post_count": len(posts),
        "total_chars": sum(len(t) for t in texts),
    }


def compare_accounts(account_a: dict, account_b: dict) -> dict:
    posts_a = account_a["posts"]
    posts_b = account_b["posts"]
    texts_a = [p["text"] for p in posts_a]
    texts_b = [p["text"] for p in posts_b]

    fp_a = build_fingerprint(posts_a)
    fp_b = build_fingerprint(posts_b)

    nlp_score, nlp_ev = _nlp_similarity(texts_a, texts_b)
    sty_score, sty_ev = stylometric_similarity(fp_a["stylometry"], fp_b["stylometry"])
    temp_score, temp_ev = temporal_overlap_similarity(fp_a["temporal"], fp_b["temporal"])

    return {
        "fingerprint_a": fp_a,
        "fingerprint_b": fp_b,
        "modality_raw": {
            "nlp": (nlp_score, nlp_ev),
            "stylometry": (sty_score, sty_ev),
            "temporal": (temp_score, temp_ev),
        },
    }
