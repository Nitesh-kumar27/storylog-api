
# 📝 StoryLog API – Journal Entry Management System

**StoryLog** is a secure, RESTful backend API that allows users to log daily thoughts, emotions, or experiences through personal journal entries. Built with Node.js, Express, and MongoDB, the API supports mood tagging, advanced filtering, and statistical summaries.

---

## 🚀 Features

- 🔐 JWT-based user authentication
- 📝 CRUD operations on personal journal entries
- 📊 Summary of mood trends and word usage
- 🔍 Filtering entries by mood, date range, and keyword
- 🧠 Word count auto-calculation
- ✅ Custom validation and error responses
- 📜 Entry versioning (bonus)
- 📋 Includes Postman collection with environment support

---

## 🧰 Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **dotenv**, **bcrypt**, **Postman**

---

## 📦 Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/Nitesh-kumar27/storylog-api
cd storylog-api
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/storylog
JWT_SECRET=yourSecretKey
```

### 3. Run the Server

```bash
npm start
```

---

## 🔐 Authentication Endpoints

### ➕ POST `/auth/register`

Registers a new user.

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

### 🔑 POST `/auth/login`

Returns JWT token.

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### ✅ Response:
```json
{
  "status": true,
  "token": "your_jwt_token"
}
```

---

## 📘 Journal Entry Endpoints

> 🔐 All routes below require `Authorization: Bearer <token>` header

### 📝 POST `/entries`

Create a new journal entry

```json
{
  "title": "A Productive Day",
  "body": "Today I completed the backend assignment with filtering and validation features.",
  "moodTags": ["productive", "relieved"],
  "moodScore": 3
}
```

- ✅ Minimum 10 words in `body`
- ✅ At least 1 mood tag
- ✅ Mood score between -5 and +5

---

### 📚 GET `/entries`

Get all entries for the logged-in user.

Optional filters:
- `?tag=happy`
- `?start=2024-01-01&end=2025-12-31`
- `?keyword=assignment`

---

### 🔍 GET `/entries/:id`

Get a specific journal entry by ID.

---

### ✏️ PUT `/entries/:id`

Update a journal entry by ID. Automatically archives the old version.

```json
{
  "title": "Updated Title",
  "body": "This updated entry has more than ten words for validation.",
  "moodTags": ["calm", "reflective"],
  "moodScore": 4
}
```

---

### ❌ DELETE `/entries/:id`

Delete a journal entry by ID.

---

### 📊 GET `/entries/summary`

Returns:
- Total entries
- Total word count
- Average mood score
- Most common mood tag

Example:
```json
{
  "status": true,
  "summary": {
    "totalEntries": 5,
    "totalWordCount": 500,
    "avgMoodScore": "3.60",
    "mostCommonMood": "happy"
  }
}
```

---

## 🧪 Postman Collection

### ✅ Import the Collection

Download and import the included file:

- `StoryLog.postman_collection.json`

### 🌐 Setup Postman Environment

Create an environment with:

| Key        | Value                  |
|------------|------------------------|
| `base_url` | `http://localhost:5000` |
| `token`    | *(empty)*

### 🔐 Auto-store Token after Login

In the `/auth/login` request → **Tests** tab:

```js
const jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
```

Use `Bearer {{token}}` in headers for secured routes.

---

## ✅ Custom Middleware & Validation

- Logs all write operations (POST, PUT, DELETE)
- Validates:
  - Minimum 10 words
  - At least one mood tag
  - Mood score in range -5 to +5
- Custom error format:
```json
{
  "status": false,
  "message": "Invalid entry ID",
  "code": 400
}
```

---

## 📧 Submission

- Push code to **public GitHub repo**
- Include:
  - `README.md`
  - `.env.example` (no real secrets)
  - Postman collection
- Email the repo link to: **info@koders.in**

---

## 👨‍💻 Author

> Created as part of the **Koders Backend Developer Assignment – 2025**  
> API designed with scalability, clarity, and developer-friendly testing in mind.
