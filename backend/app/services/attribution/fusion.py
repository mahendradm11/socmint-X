"""Multi-modal fusion with explainable attribution scoring (Phase 5)."""

WEIGHTS = {
    "nlp": 0.25,
    "stylometry": 0.25,
    "temporal": 0.20,
    "image": 0.15,
    "graph": 0.15,
}


def _risk_level(score: float) -> str:
    if score >= 0.85:
        return "CONFIRMED"
    if score >= 0.70:
        return "HIGH"
    if score >= 0.50:
        return "MEDIUM"
    if score >= 0.30:
        return "LOW"
    return "INSUFFICIENT DATA"


def fuse_attribution(
    *,
    account_a_label: str,
    account_b_label: str,
    modality_raw: dict[str, tuple[float, str]],
) -> dict:
    available = {k: v for k, v in modality_raw.items() if v[0] is not None}
    weight_sum = sum(WEIGHTS[k] for k in available) or 1.0

    modality_scores = []
    reasoning = []
    ensemble = 0.0

    labels = {
        "nlp": "NLP Textual Similarity",
        "stylometry": "Stylometric Fingerprint",
        "temporal": "Temporal Behavior Overlap",
        "image": "Image Intelligence",
        "graph": "Graph Proximity",
    }

    for key, (score, evidence) in available.items():
        w = WEIGHTS[key]
        normalized_w = w / weight_sum
        contribution = score * normalized_w
        ensemble += contribution
        modality_scores.append(
            {
                "modality": labels.get(key, key),
                "weight": round(normalized_w, 3),
                "score": round(score, 4),
                "contribution": round(contribution, 4),
                "evidence": evidence,
            }
        )
        reasoning.append(
            f"{labels.get(key, key)}: {score:.0%} (weight {normalized_w:.0%}) — {evidence}"
        )

    for placeholder, msg in [
        ("image", "Image modality not supplied — public profile thumbnails can be added in a future run."),
        ("graph", "Graph proximity requires Neo4j entity linkage — populate graph from case indicators first."),
    ]:
        if placeholder not in available:
            reasoning.append(f"{labels[placeholder]}: skipped — {msg}")

    ensemble = round(min(1.0, max(0.0, ensemble)), 4)
    risk = _risk_level(ensemble)

    summary = (
        f"Attribution between '{account_a_label}' and '{account_b_label}': "
        f"{ensemble:.0%} confidence ({risk}). "
        f"Consensus across {len(available)} active modalities."
    )
    reasoning.insert(0, summary)

    return {
        "confidence_score": ensemble,
        "risk_level": risk,
        "modality_scores": modality_scores,
        "reasoning_chain": reasoning,
    }
