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
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contents (
    id SERIAL PRIMARY KEY,
    track_id INTEGER REFERENCES track(id) NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    duration TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    url_image TEXT,
    creator TEXT NOT NULL,
    subtitle TEXT NOT NULL
);

CREATE TABLE user_tracks (
    user_id INTEGER NOT NULL REFERENCES users(id),
    track_id INTEGER NOT NULL REFERENCES tracks(id)
);

CREATE TABLE IF NOT EXISTS user_contents (
  	user_id INTEGER NOT NULL REFERENCES users(id),
  	content_id INTEGER NOT NULL REFERENCES contents(id),
    track_id INTEGER NOT NULL REFERENCES tracks(id),
    complete BOOLEAN NOT NULL
);