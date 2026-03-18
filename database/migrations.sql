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

-- inserisco 20 squadre
INSERT INTO teams (name) VALUES
('Inter'),
('Milan'),
('Napoli'),
('Como'),
('Juventus'),
('Roma'),
('Atalanta'),
('Sassuolo'),
('Bologna'),
('Lazio'),
('Parma'),
('Udinese'),
('Genoa'),
('Cagliari'),
('Fiorentina'),
('Torino'),
('Cremonese'),
('Lecce'),
('Verona'),
('Pisa');

-- inserisco 8 settimane
INSERT INTO weeks (week_number) VALUES
(1), (2), (3), (4), (5), (6), (7), (8);

-- inserisco 10 partite per ogni settimana (80 partite totali)
-- result: '1' vittoria casa, 'X' pareggio, '2' vittoria trasferta
INSERT INTO matches (week_id, home_team_id, away_team_id, result) VALUES
-- settimana 1
(1, 1, 2, '1'),
(1, 3, 4, 'X'),
(1, 5, 6, '2'),
(1, 7, 8, '1'),
(1, 9, 10, 'X'),
(1, 11, 12, '2'),
(1, 13, 14, '1'),
(1, 15, 16, 'X'),
(1, 17, 18, '2'),
(1, 19, 20, '1'),
-- settimana 2
(2, 2, 3, 'X'),
(2, 4, 5, '2'),
(2, 6, 7, '1'),
(2, 8, 9, 'X'),
(2, 10, 11, '2'),
(2, 12, 13, '1'),
(2, 14, 15, 'X'),
(2, 16, 17, '2'),
(2, 18, 19, '1'),
(2, 20, 1, 'X'),
-- settimana 3
(3, 1, 3, '2'),
(3, 2, 5, '1'),
(3, 4, 6, 'X'),
(3, 7, 9, '2'),
(3, 8, 10, '1'),
(3, 11, 13, 'X'),
(3, 12, 14, '2'),
(3, 15, 17, '1'),
(3, 16, 18, 'X'),
(3, 19, 20, '2'),
-- settimana 4
(4, 2, 4, '1'),
(4, 3, 5, 'X'),
(4, 6, 8, '2'),
(4, 7, 11, '1'),
(4, 9, 13, 'X'),
(4, 10, 14, '2'),
(4, 12, 16, '1'),
(4, 15, 19, 'X'),
(4, 17, 20, '2'),
(4, 18, 1, '1'),
-- settimana 5
(5, 1, 4, 'X'),
(5, 2, 7, '2'),
(5, 3, 8, '1'),
(5, 5, 10, 'X'),
(5, 6, 11, '2'),
(5, 9, 14, '1'),
(5, 12, 17, 'X'),
(5, 13, 18, '2'),
(5, 15, 20, '1'),
(5, 16, 19, 'X'),
-- settimana 6
(6, 1, 5, '2'),
(6, 2, 6, '1'),
(6, 3, 9, 'X'),
(6, 4, 10, '2'),
(6, 7, 12, '1'),
(6, 8, 13, 'X'),
(6, 11, 16, '2'),
(6, 14, 19, '1'),
(6, 17, 18, 'X'),
(6, 20, 15, '2'),
-- settimana 7
(7, 1, 6, '1'),
(7, 2, 9, 'X'),
(7, 3, 10, '2'),
(7, 4, 11, '1'),
(7, 5, 12, 'X'),
(7, 7, 14, '2'),
(7, 8, 15, '1'),
(7, 13, 18, 'X'),
(7, 16, 20, '2'),
(7, 17, 19, '1'),
-- settimana 8
(8, 1, 7, 'X'),
(8, 2, 10, '2'),
(8, 3, 11, '1'),
(8, 4, 12, 'X'),
(8, 5, 13, '2'),
(8, 6, 14, '1'),
(8, 8, 16, 'X'),
(8, 9, 17, '2'),
(8, 15, 18, '1'),
(8, 19, 20, 'X');