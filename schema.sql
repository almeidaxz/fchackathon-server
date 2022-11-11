CREATE DATABASE fchackathon;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tracks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contents (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    duration TEXT NULL,
    complete BOOLEAN NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    url_image TEXT
);

CREATE TABLE user_track (
    id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    track_id INTEGER NOT NULL
);

CREATE TABLE track_content (
    id INTEGER NOT NULL,
    track_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL
);

ALTER TABLE
    user_track ADD CONSTRAINT user_track_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE
    user_track ADD CONSTRAINT user_track_track_id_foreign FOREIGN KEY(track_id) REFERENCES tracks(id);
ALTER TABLE
    track_content ADD CONSTRAINT track_content_track_id_foreign FOREIGN KEY(track_id) REFERENCES tracks(id);
ALTER TABLE
    track_content ADD CONSTRAINT track_content_content_id_foreign FOREIGN KEY(content_id) REFERENCES contents(id);

ALTER TABLE user_track DROP COLUMN id;

/* ATUALIZAÇÃO NA MODELAGEM DO BD */
CREATE TABLE IF NOT EXISTS contents (
    id SERIAL PRIMARY KEY,
  	track_id INTEGER NOT NULL REFERENCES tracks(id),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    duration TEXT NULL,
    complete BOOLEAN NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    url_image TEXT
);

ALTER TABLE tracks DROP COLUMN status;