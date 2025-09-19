# Mood Logger App

A simple **Mood Logging Application** built with Node.js, PostgreSQL, and JWT authentication.

---

## Prerequisites
- **Node.js** version `v22.14.0` or greater must be installed
- **PostgreSQL** must be installed and running

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Harshgaur14/Mood_Logger_App.git
```
Or download the ZIP and extract it manually.

### 2. Navigate to the Project Directory
```bash
cd Mood_Logger_App
```

### 3. Install Dependencies
```bash
npm install
```

---

## Environment Setup

Create a `.env` file in the root directory and configure it as follows:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=moodlogger_test   # Your database name
DB_PASSWORD=password      # Your database password
DB_PORT=5432

PORT=3001                 # Application running port
JWT_SECRET=Xp2HrE0cJ8zA7GfL6MqNvK9BtO5UdI3WjPwY4TlQxS1RyZnFmKkVva
OPENAI_API_KEY=
```

---

## Database Initialization

Before starting the project, initialize the database tables:
```bash
node initModels.js
```

---

## Running the Application

Start the application:
```bash
npm start
```

By default, it will run on the port defined in `.env` (example: `http://localhost:3001`).

---

## API Endpoints

### Signup
**POST** `http://localhost:3001/signup`

**Request Body:**
```json
{
  "name": "Harsh Demo",
  "email": "gaur.harsh0014@gmail.com",
  "password": "harsh14"
}
```

---

### Login
**POST** `http://localhost:3001/login`

**Request Body:**
```json
{
  "email": "gaur.harsh0014@gmail.com",
  "password": "harsh14"
}
```

---

### Moods API
- **POST** `http://localhost:3001/api/moods`
  ```json
  {
    "moodType": "stressed",
    "note": "Feeling pressure at work and deadlines are piling up"
  }
  ```

- **GET** `http://localhost:3001/api/moods`
- **GET** `http://localhost:3001/api/moods/weekly`
- **GET** `http://localhost:3001/api/moods/monthly`
- **DELETE** `http://localhost:3001/api/moods/:id`

---

### Daily Quotes API
**GET** `http://localhost:3001/api/quotes/today`

---

### ChatBot API
- **POST** `http://localhost:3001/api/conversations`
  ```json
  {
    "message": "I feel overwhelmed with work."
  }
  ```

---

### Conversation History API
- **GET** `http://localhost:3001/api/conversations`

---
