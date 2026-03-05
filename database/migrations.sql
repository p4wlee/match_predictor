-- creo il database e lo seleziono
CREATE DATABASE IF NOT EXISTS match_db;
USE match_db;

-- creo la tabella degli utenti
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR (50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    role ENUM ('user', 'admin') NOT NULL DEFAULT 'user',
    refresh_token VARCHAR (512),
    refresh_token_expires_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- creo la tabella delle squadre
CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (100) NOT NULL UNIQUE
);

-- creo la tabella delle settimane
CREATE TABLE weeks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    week_number INT NOT NULL UNIQUE
);

-- creo la tabella delle partite
-- home_team_id e away_team_id sono foreign key verso teams
-- week_id è foreign key verso weeks
CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    week_id INT NOT NULL,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    result ENUM('1', 'X', '2') NOT NULL,
    FOREIGN KEY (week_id) REFERENCES weeks(id),
    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    FOREIGN KEY (away_team_id) REFERENCES teams(id)
);

-- creo la tabella dei pronostici
CREATE TABLE predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    match_id INT NOT NULL,
    prediction ENUM ('1','X','2') NOT NULL,
    points_awarded INT NOT NULL DEFAULT 0,
    UNIQUE (user_id, match_id), -- questo garantisce che un utente possa inserire una sola scommessa per partita
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);