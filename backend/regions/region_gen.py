from math import sqrt
from collections import deque
from typing import List

def group_points_into_regions(
    items: List[list],
    spatial_eps: float = 0.15,
    priority_eps: float = 0.2,
    min_region_size: int = 1,
):
    if not items:
        return []

    def spatial_dist(a, b):
        return sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2)

    def priority_dist(a, b):
        return abs(a[2] - b[2])

    xs = [p[0] for p in items]
    ys = [p[1] for p in items]
    priorities = [p[2] for p in items]

    def norm(vals):
        lo, hi = min(vals), max(vals)
        if hi == lo:
            return [0.0 for _ in vals]
        return [(v - lo) / (hi - lo) for v in vals]

    nx = norm(xs)
    ny = norm(ys)
    np = norm(priorities)

    norm_items = [
        [nx[i], ny[i], np[i]]
        for i in range(len(items))
    ]

    n = len(items)
    visited = [False] * n
    regions = []

    neighbors = [[] for _ in range(n)]

    for i in range(n):
        for j in range(i + 1, n):
            s_dist = spatial_dist(norm_items[i], norm_items[j])
            p_dist = priority_dist(norm_items[i], norm_items[j])

            if s_dist <= spatial_eps and p_dist <= priority_eps:
                neighbors[i].append(j)
                neighbors[j].append(i)

    for i in range(n):
        if visited[i]:
            continue

        queue = deque([i])
        visited[i] = True
        region = []

        while queue:
            cur = queue.popleft()
            region.append(items[cur])

            for nxt in neighbors[cur]:
                if not visited[nxt]:
                    visited[nxt] = True
                    queue.append(nxt)

        if len(region) >= min_region_size:
            regions.append(region)

    return regions
