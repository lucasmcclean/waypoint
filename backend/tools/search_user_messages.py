from typing import Dict, Any

from messages.user_message import query_user_messages

def search_user_messages(
    query: str,
    top_k: int = 5,
    user_id: str = None,
    radius_meters: float = None,
    lat: float = None,
    lon: float = None,
    extra_filters: Dict[str, Any] = None
) -> str:
    return query_user_messages(query)
