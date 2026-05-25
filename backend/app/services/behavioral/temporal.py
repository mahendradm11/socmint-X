"""Temporal fingerprinting — active hours, posting rhythm, timezone inference."""

from collections import Counter
from datetime import datetime

from dateutil import parser as date_parser


def _parse_hour(ts: str | None) -> int | None:
    if not ts:
        return None
    try:
        dt = date_parser.isoparse(ts)
        return dt.hour
    except (ValueError, TypeError):
        return None


def extract_temporal(posts: list[dict]) -> dict:
    hours: list[int] = []
    gaps_hours: list[float] = []
    parsed_times: list[datetime] = []

    for post in posts:
        ts = post.get("timestamp")
        if not ts:
            continue
        try:
            dt = date_parser.isoparse(ts)
            parsed_times.append(dt)
            hours.append(dt.hour)
        except (ValueError, TypeError):
            continue

    parsed_times.sort()
    for i in range(1, len(parsed_times)):
        delta = (parsed_times[i] - parsed_times[i - 1]).total_seconds() / 3600
        if 0 < delta < 168:
            gaps_hours.append(delta)

    hour_dist = Counter(hours)
    total = max(len(hours), 1)
    active_hours = {str(h): round(c / total, 3) for h, c in sorted(hour_dist.items())}

    inferred_tz = None
    if hours:
        peak = hour_dist.most_common(1)[0][0]
        if 6 <= peak <= 11:
            inferred_tz = "Likely IST morning activity (UTC+5:30)"
        elif 20 <= peak <= 23:
            inferred_tz = "Likely IST evening activity (UTC+5:30)"

    return {
        "posts_with_timestamps": len(hours),
        "active_hour_distribution": active_hours,
        "peak_hour": hour_dist.most_common(1)[0][0] if hour_dist else None,
        "avg_gap_hours": round(sum(gaps_hours) / len(gaps_hours), 2) if gaps_hours else None,
        "inferred_timezone_hint": inferred_tz,
    }


def temporal_overlap_similarity(temp_a: dict, temp_b: dict) -> tuple[float, str]:
    dist_a = temp_a.get("active_hour_distribution", {})
    dist_b = temp_b.get("active_hour_distribution", {})

    if not dist_a or not dist_b:
        return 0.0, "Insufficient timestamped posts for temporal analysis."

    keys = set(dist_a) | set(dist_b)
    intersection = sum(min(dist_a.get(k, 0), dist_b.get(k, 0)) for k in keys)
    union = sum(max(dist_a.get(k, 0), dist_b.get(k, 0)) for k in keys)
    jaccard = intersection / union if union > 0 else 0.0

    peak_match = temp_a.get("peak_hour") == temp_b.get("peak_hour") and temp_a.get("peak_hour") is not None
    boost = 0.1 if peak_match else 0.0
    score = min(1.0, jaccard + boost)

    evidence = (
        f"Active-hour Jaccard overlap {jaccard:.0%}"
        + (f"; identical peak hour {temp_a['peak_hour']}:00" if peak_match else "")
        + (
            f"; {temp_a.get('inferred_timezone_hint') or ''}"
            if temp_a.get("inferred_timezone_hint")
            else ""
        )
    )
    return score, evidence.strip()
