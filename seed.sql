-- DROP DATABASE IF exists dougtv;
-- CREATE DATABASE dougtv;
-- \c dougtv;

DROP TABLE IF exists broadcasters; 
CREATE TABLE broadcasters (
    id SERIAL PRIMARY KEY,
    socket_id VARCHAR,
    username VARCHAR,
    broadcaster_active BOOLEAN DEFAULT TRUE
);
