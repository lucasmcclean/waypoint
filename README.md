# Waypoint

Waypoint is a centralized emergency response system that connects surivovrs to first time responders and allow first time responders to use AI optimize their response. The system features:

- Distress Heatmaps
- Realtime Communication between surviors & Responders
- Region Specfic Report
- RAG Querying to target urgent situtations

### How it Works

The app has two portals that users can jump into:

1. Survivor Portal: Allow users to send messages and view locations of responders. The messages are stored as a vector embedding in a vector database that stores all user messages. The messages also creates distress heatmaps on the map on various regions which allow responders to easily learn about regional situations and prioritize regions.
2. Responder Portal: The user is able to query specific details about overall situations from all situations. Additionally users can track users and regions on the network and click on specific regions to find out about situations in that region. Users are also able to brodcast messages to survivors.

### Setting it up
1. Docker Installed
2. Gemini API Key present as `GEMINI_API_KEY` in the `docker-compose.yml` inside the `backend` service

