# ⚽ Match Predictor API

A RESTful API for a football match prediction system, built with **Node.js**, **Express**, and **MySQL**. Users can register, log in, and place predictions on football matches. The system automatically awards points based on the accuracy of each prediction and generates both weekly and overall leaderboards.

---

## 📌 Features

- JWT-based authentication with access token and refresh token
- Role-based access control (user / admin)
- Full CRUD for matches, teams, and weeks (admin only)
- Prediction system with automatic point assignment
- Weekly and overall leaderboard with filtering and sorting
- 61 unit tests using Mocha, Chai, and Sinon

---

## 🧱 Tech Stack

| Technology   | Purpose                           |
| ------------ | --------------------------------- |
| Node.js      | Runtime environment               |
| Express      | Web framework                     |
| MySQL        | Relational database               |
| mysql2       | MySQL driver with Promise support |
| jsonwebtoken | JWT generation and verification   |
| bcrypt       | Password hashing                  |
| dotenv       | Environment variable management   |
| Mocha        | Test runner                       |
| Chai         | Assertion library                 |
| Sinon        | Stubs and mocks for unit testing  |

---

## 📁 Project Structure

```
match_predictor/
│
├── database/
│   └── migrations.sql          # Database schema and seed data
│
├── src/
│   ├── config/
│   │   └── db.js               # MySQL connection pool
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   └── isAdmin.js          # Admin role authorization middleware
│   ├── models/                 # Database query functions
│   ├── controllers/            # Business logic
│   ├── routes/                 # Express routers
│   └── app.js                  # Express app setup
│
├── tests/                      # Unit tests
├── .env.example                # Environment variables template
├── package.json
└── server.js                   # Entry point
```

---

## ⚙️ Requirements

- Node.js v18 or higher
- MySQL 5.7 or higher (or MariaDB equivalent)

---

## 🚀 Installation

**1. Clone the repository**

```bash
git clone https://github.com/p4wlee/match_predictor.git
cd match_predictor
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Copy the `.env.example` file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and configure:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=match_db

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
```

**4. Set up the database**

Open your MySQL client (e.g. Beekeeper Studio, MySQL Workbench) and run the `database/migrations.sql` file. This will:

- Create the `match_db` database
- Create all tables (`users`, `teams`, `weeks`, `matches`, `predictions`)
- Insert seed data (20 teams, 8 weeks, 80 matches)

**5. Start the server**

```bash
npm start
```

The server will start on `http://localhost:3000`.

---

## 🧪 Running Tests

```bash
npm test
```

The test suite includes **61 unit tests** covering all controllers and middleware, using Sinon stubs to isolate business logic from the database layer.

---

## 🗄️ Database Schema

### users

| Field                    | Type                  | Notes           |
| ------------------------ | --------------------- | --------------- |
| id                       | INT PK AUTO_INCREMENT |                 |
| username                 | VARCHAR(50)           | UNIQUE          |
| email                    | VARCHAR(100)          | UNIQUE          |
| password                 | VARCHAR(255)          | bcrypt hashed   |
| role                     | ENUM('user','admin')  | default: 'user' |
| refresh_token            | VARCHAR(512)          | nullable        |
| refresh_token_expires_at | DATETIME              | nullable        |
| created_at               | TIMESTAMP             | default: now    |

### teams

| Field | Type                  | Notes  |
| ----- | --------------------- | ------ |
| id    | INT PK AUTO_INCREMENT |        |
| name  | VARCHAR(100)          | UNIQUE |

### weeks

| Field       | Type                  | Notes        |
| ----------- | --------------------- | ------------ |
| id          | INT PK AUTO_INCREMENT |              |
| week_number | INT                   | UNIQUE (1-8) |

### matches

| Field        | Type                  | Notes      |
| ------------ | --------------------- | ---------- |
| id           | INT PK AUTO_INCREMENT |            |
| week_id      | INT FK                | → weeks.id |
| home_team_id | INT FK                | → teams.id |
| away_team_id | INT FK                | → teams.id |
| result       | ENUM('1','X','2')     |            |

### predictions

| Field          | Type                  | Notes        |
| -------------- | --------------------- | ------------ |
| id             | INT PK AUTO_INCREMENT |              |
| user_id        | INT FK                | → users.id   |
| match_id       | INT FK                | → matches.id |
| prediction     | ENUM('1','X','2')     |              |
| points_awarded | INT                   | 0 or 3       |

> The combination `(user_id, match_id)` is UNIQUE — one prediction per match per user.

---

## 🔐 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication.

After logging in, you receive two tokens:

- **Access Token**: short-lived (1 hour), used to authenticate requests
- **Refresh Token**: long-lived (7 days), used to obtain a new access token without logging in again

Include the access token in the `Authorization` header of every protected request:

```
Authorization: Bearer <your_access_token>
```

### Point System

| Prediction | Result                  | Points |
| ---------- | ----------------------- | ------ |
| Correct    | Matches official result | 3      |
| Incorrect  | Does not match          | 0      |

Points are assigned immediately when a prediction is submitted, since all match results are already known at insertion time.

---

## 📡 API Endpoints

### AUTH

| Method | Endpoint       | Auth    | Description              |
| ------ | -------------- | ------- | ------------------------ |
| POST   | /auth/register | Public  | Register a new user      |
| POST   | /auth/login    | Public  | Login and receive tokens |
| POST   | /auth/refresh  | Public  | Get a new access token   |
| POST   | /auth/logout   | 🔒 User | Invalidate refresh token |

### USERS

| Method | Endpoint   | Auth    | Description                 |
| ------ | ---------- | ------- | --------------------------- |
| GET    | /users/me  | 🔒 User | Get authenticated user data |
| GET    | /users/:id | Public  | Get public data of a user   |

### TEAMS

| Method | Endpoint | Auth     | Description           |
| ------ | -------- | -------- | --------------------- |
| GET    | /teams   | Public   | Get list of all teams |
| POST   | /teams   | 🔒 Admin | Create a new team     |

### WEEKS

| Method | Endpoint | Auth     | Description           |
| ------ | -------- | -------- | --------------------- |
| GET    | /weeks   | Public   | Get list of all weeks |
| POST   | /weeks   | 🔒 Admin | Create a new week     |

### MATCHES

| Method | Endpoint     | Auth     | Description                          |
| ------ | ------------ | -------- | ------------------------------------ |
| GET    | /matches     | Public   | Get all matches (filterable by week) |
| GET    | /matches/:id | Public   | Get match details with team names    |
| POST   | /matches     | 🔒 Admin | Create a new match                   |

**Query parameters for GET /matches:**

- `week` → filter by week number (e.g. `?week=3`)

### PREDICTIONS

| Method | Endpoint               | Auth    | Description                          |
| ------ | ---------------------- | ------- | ------------------------------------ |
| POST   | /matches/:id/predict   | 🔒 User | Submit a prediction for a match      |
| GET    | /users/me/predictions  | 🔒 User | Get authenticated user's predictions |
| GET    | /users/:id/predictions | Public  | Get predictions of a specific user   |

### LEADERBOARD

| Method | Endpoint     | Auth   | Description             |
| ------ | ------------ | ------ | ----------------------- |
| GET    | /leaderboard | Public | Get overall leaderboard |

**Query parameters for GET /leaderboard:**

- `week` → filter by week number (e.g. `?week=3`)
- `sort` → sort by points: `asc` or `desc` (default: `desc`)

**Examples:**

```
GET /leaderboard
GET /leaderboard?week=3
GET /leaderboard?sort=asc
GET /leaderboard?week=2&sort=desc
```

**Leaderboard response fields:**

| Field               | Description                                 |
| ------------------- | ------------------------------------------- |
| username            | Player username                             |
| total_bets          | Total predictions placed                    |
| total_points        | Total points earned                         |
| correct_predictions | Number of correct predictions               |
| wrong_predictions   | Number of wrong predictions                 |
| accuracy            | Accuracy percentage (rounded to 2 decimals) |

---

## 📬 Contacts

- **GitHub:**  
  https://github.com/p4wlee

- **LinkedIn:**  
  https://www.linkedin.com/in/davide-paulicelli-00295222b/

---

## 📄 License

This project is open source and available under the **MIT** license.
