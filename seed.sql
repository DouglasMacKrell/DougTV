DROP DATABASE IF EXISTS videobox;
CREATE DATABASE videobox;
\c videobox;

CREATE TABLE broadcasters (
    id SERIAL PRIMARY KEY,
    socket_id VARCHAR,
    username VARCHAR,
    active BOOLEAN DEFAULT TRUE
);

-- SEED DATA

INSERT INTO broadcasters (username, socket_id)
    VALUES ('Suzette', '1234'), 
            ('Maliq', '5678'),
            ('Douglas', '4321');


-- TESTS

SELECT * FROM broadcasters;