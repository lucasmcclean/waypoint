CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE user_messages (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT,
    time TIMESTAMP DEFAULT NOW(),
    location_geom GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_messages_user ON user_messages(user_id);
CREATE INDEX idx_user_messages_time ON user_messages(time);
CREATE INDEX idx_user_messages_location ON user_messages USING GIST(location_geom);

CREATE TABLE responder_messages (
    id SERIAL PRIMARY KEY,
    user_id TEXT,
    content TEXT,
    time TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_responder_messages_time ON responder_messages(time);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  location_geom GEOGRAPHY(POINT, 4326),
  priority INT DEFAULT 0
);

CREATE TABLE responders (
  id TEXT PRIMARY KEY,
  location_geom GEOGRAPHY(POINT, 4326)
);

INSERT INTO users (id, priority, location_geom) VALUES
('bc476d92-bc08-4e09-95e7-f980c1513554', 0, ST_SetSRID(ST_MakePoint(-82.392966, 27.929091), 4326)::geography),
('c1bac9b4-3cd1-4983-aba7-962b42550dba', 0, ST_SetSRID(ST_MakePoint(-82.359585, 28.056834), 4326)::geography),
('0c1c2fae-8537-44d7-9777-a3ad26a9b030', 0, ST_SetSRID(ST_MakePoint(-82.561366, 27.72389), 4326)::geography),
('a03ed8d3-d938-41ba-a21a-a33bfb0d0681', 0, ST_SetSRID(ST_MakePoint(-82.499022, 28.040398), 4326)::geography),
('2f2ec79c-a872-4959-a1bc-dc8e7570af6d', 0, ST_SetSRID(ST_MakePoint(-82.66826, 27.895004), 4326)::geography),
('036e1d73-fa6a-4128-9578-c9b9d1ce24c1', 0, ST_SetSRID(ST_MakePoint(-82.27248, 28.037858), 4326)::geography),
('226a12ab-0f39-4b1e-8c12-194630ebda02', 0, ST_SetSRID(ST_MakePoint(-82.673006, 27.811902), 4326)::geography),
('f104e487-7747-44c2-b3ab-9bb6a41a039a', 0, ST_SetSRID(ST_MakePoint(-82.564874, 27.990228), 4326)::geography),
('054d5929-4ceb-4e37-b894-bd19a704bc79', 0, ST_SetSRID(ST_MakePoint(-82.777882, 27.794655), 4326)::geography),
('e8d5dcc1-1ebf-4e1d-9b8f-56037c010a32', 0, ST_SetSRID(ST_MakePoint(-82.534555, 28.090969), 4326)::geography),
('92ade814-1def-4914-b46a-75625cca40fe', 0, ST_SetSRID(ST_MakePoint(-82.723495, 28.02381), 4326)::geography),
('99373c85-1c5f-4954-9268-bb67277a7afb', 0, ST_SetSRID(ST_MakePoint(-82.59902, 28.03392), 4326)::geography),
('71bd91ef-ce11-44b1-b9a3-7e387a5d47c5', 0, ST_SetSRID(ST_MakePoint(-82.681404, 27.762443), 4326)::geography),
('6f87ae0d-ec78-4c1d-a631-176bcaf09e44', 0, ST_SetSRID(ST_MakePoint(-82.360103, 27.906804), 4326)::geography),
('d729fc64-616d-4d33-b618-a701e16c7e32', 0, ST_SetSRID(ST_MakePoint(-82.664737, 27.853521), 4326)::geography),
('778af074-de68-454c-8522-b303b7666e24', 0, ST_SetSRID(ST_MakePoint(-82.52646, 27.854808), 4326)::geography),
('a8871f19-02d7-4dce-b238-6aaec6dfc9e8', 0, ST_SetSRID(ST_MakePoint(-82.385695, 28.074718), 4326)::geography),
('872996e4-8f54-4d86-a473-7dca61a3fe7f', 0, ST_SetSRID(ST_MakePoint(-82.551667, 27.998716), 4326)::geography),
('f9ce5951-5669-4e7d-9bcb-a9a89dbb1a1c', 0, ST_SetSRID(ST_MakePoint(-82.267297, 27.980279), 4326)::geography),
('a69a870d-a95d-4714-9900-941a9aa6f4b7', 0, ST_SetSRID(ST_MakePoint(-82.245395, 28.11509), 4326)::geography),
('977b9642-9fbb-4fae-a5bd-b4d940c3660b', 0, ST_SetSRID(ST_MakePoint(-82.505056, 27.937086), 4326)::geography),
('3dfbca43-30f8-4028-9cbe-3e588270d653', 0, ST_SetSRID(ST_MakePoint(-82.40009, 28.068138), 4326)::geography),
('b72cc14c-1604-4db7-b67d-c3597977de38', 0, ST_SetSRID(ST_MakePoint(-82.765987, 27.892314), 4326)::geography),
('3c1fa467-4c5b-4c4f-8738-75ea8241c3c8', 0, ST_SetSRID(ST_MakePoint(-82.280728, 27.738666), 4326)::geography),
('1433f2c2-36db-4097-80af-14f5a76b7ed9', 0, ST_SetSRID(ST_MakePoint(-82.232799, 27.749329), 4326)::geography),
('cd862e23-c34e-4c2d-a783-dabe7719aa53', 0, ST_SetSRID(ST_MakePoint(-82.630092, 27.810301), 4326)::geography),
('5f52cf77-2a8f-4def-93c2-a1cd22403a02', 0, ST_SetSRID(ST_MakePoint(-82.73884, 27.89769), 4326)::geography),
('0179c3f1-4640-4efe-b1f3-96b32d615f9f', 0, ST_SetSRID(ST_MakePoint(-82.721212, 27.728672), 4326)::geography),
('eea30d6d-d33e-4078-a51d-1d4ef0be32fc', 0, ST_SetSRID(ST_MakePoint(-82.556145, 27.826202), 4326)::geography),
('b2d843d9-ecb1-4b84-9604-36b351b07357', 0, ST_SetSRID(ST_MakePoint(-82.755704, 27.808995), 4326)::geography);
