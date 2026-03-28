CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE user_messages (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT,
    time TIMESTAMP DEFAULT NOW(),
    location_geom geography(POINT, 4326),
    created_at TIMESTAMP DEFAULT NOW(),
    content_tsv tsvector
);

UPDATE user_messages SET content_tsv = to_tsvector('english', content);

CREATE INDEX idx_fts ON user_messages USING GIN(content_tsv);
CREATE INDEX idx_embedding ON user_messages USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
CREATE INDEX idx_location ON user_messages USING GIST(location_geom);

CREATE INDEX idx_user_messages_user ON user_messages(user_id);
CREATE INDEX idx_user_messages_time ON user_messages(time);
CREATE INDEX idx_user_messages_location ON user_messages USING GIST(location_geom);

CREATE TABLE responder_messsages (
    id SERIAL PRIMARY KEY,
    content TEXT,
    time TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    content_tsv tsvector
);

UPDATE responder_messages SET content_tsv = to_tsvector('english', content);

CREATE INDEX idx_fts ON responder_messages USING GIN(content_tsv);

CREATE INDEX idx_responder_messages_user ON responder_messages(user_id);
CREATE INDEX idx_responder_messages_time ON responder_messages(time);
