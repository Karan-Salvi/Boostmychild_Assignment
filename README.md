# Attendance Management System - Boostmychild Assignment

A attendance tracking system allowing teachers to manage users, mark attendance, view summaries, and visualize data on a calendar using FullCalendar.

---

## Live Demo

You can view the live deployed version of the project here:

**[https://boostmychild.vercel.app](https://boostmychild.vercel.app/)**

---

## !!! Important Note About Backend Response Time

The backend is deployed on **Render's free tier**, which means:

* The server **goes to sleep** if there is no activity for some time.
* The **first request may take 10–20 seconds** to wake up.
* After waking up, all requests work normally and quickly.

This delay is **not an issue in the code or the backend**, but simply a limitation of free hosting.

---

## Application Preview

### Main Page

<img src="./Frontend/public/screenshots/CalenderPage.png" alt="Calender Page" >

### Add Student

<img src="./Frontend/public/screenshots/AddStudent.png" alt="Calender Page" >

### Attendance Panel

<img src="./Frontend/public/screenshots/AttendancePanel.png" alt="Calender Page" >

### Status Update

<img src="./Frontend/public/screenshots/EditStatus.png" alt="Calender Page" >

### Remark (Optional)

<img src="./Frontend/public/screenshots/RemarkPage.png" alt="Calender Page" >

### Refresh Panel

<img src="./Frontend/public/screenshots/RefreshPage.png" alt="Calender Page" >

---

## Features Overview

- Add users with name and role number.
- Record daily attendance: Present, Absent, Leave.
- Submit bulk attendance for faster updates.
- Fetch attendance by specific date.
- Generate daily summary in the format: `P: X / A: Y / L: Z`.
- Generate monthly summary for calendar visualization.
- A small dot appears on dates where attendance is marked.
- Calendar uses colors to make it easier to understand:
  - If more students are absent than present, the date shows a red color.
  - If more students are present than absent, the date shows a green color.
  - If both are equal, a normal/neutral color is shown.
- FullCalendar integration for an interactive UI.
- Modular backend structure: Controllers, Routes, Models, Middleware.
- Efficient API data caching and fetching using Redux Toolkit and RTK Query.

---

## Tech Stack

### Table Format

| Layer            | Technology Used                                                    |
| ---------------- | ------------------------------------------------------------------ |
| Frontend         | React (Vite), Tailwind CSS, FullCalendar, Redux Toolkit, RTK Query |
| Backend          | Node.js, Express.js                                                |
| Database         | MongoDB, Mongoose                                                  |
| API Style        | REST API +                                                         |
| Styling          | Tailwind CSS                                                       |
| State Management | Redux Toolkit                                                      |
| Calendar Library | FullCalendar                                                       |

---

# How to Run Locally

Steps to set up both backend and frontend starting from cloning the project repository.

---

## 1. Clone the GitHub Repository

```sh
git clone https://github.com/Karan-Salvi/Boostmychild_Assignment.git
```

## 2. Navigate to the Project Directory

```sh
cd Boostmychild_Assignment
```

The project contains two folders:

- Backend
- Frontend

Both need to be configured separately.

---

# Backend Setup

### 1. Navigate to Backend Folder

```sh
cd Backend
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Create .env File

Inside the Backend folder, create a `.env` file:

```
PORT=8000
FRONTEND_URI=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=AttendanceDB
```

### 4. Start the Backend Server

```sh
npm run dev
```

Backend will run at:

```
http://localhost:8000
```

### For locally if you want add initial users to database seed Initial Users

```sh
npm run seed:users
```

---

# Frontend Setup

### 1. Navigate to Frontend Folder

Open a new terminal:

```sh
cd Frontend
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Create .env File

Inside the Frontend folder, create a `.env` file:

```
VITE_API_URL=http://localhost:8000
```

### 4. Start the Frontend Development Server

```sh
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# Backend API Endpoints

## Users API

### Create User

**POST** `/api/users`

Request body:

```json
{
  "name": "John Doe",
  "role_no": 101
}
```

Response:

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "6921c9ee5d67c52626f56576",
    "name": "John Doe",
    "role_no": 101
  }
}
```

---

### Get All Users

**GET** `/api/users`

Response:

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "users": [
    {
      "_id": "6921c9ee5d67c52626f56576",
      "name": "John Doe",
      "role_no": 101
    }
  ]
}
```

---

## Attendance API

### Get Attendance by Date

**GET** `/api/attendance?date=YYYY-MM-DD`

Example:

```
/api/attendance?date=2025-11-22
```

Response:

```json
{
  "success": true,
  "date": "2025-11-22",
  "day": "22",
  "month": "2025-11",
  "summary": {
    "present": 2,
    "absent": 1,
    "leave": 1,
    "formatted": "P: 2 / A: 1 / L: 1"
  },
  "records": [
    {
      "_id": "xxx",
      "userId": {
        "_id": "6921c9ee5d67c52626f56576",
        "name": "John Doe",
        "role_no": 101
      },
      "status": "present",
      "remark": ""
    }
  ],
  "monthSummary": [
    {
      "date": "2025-11-01",
      "present": 3,
      "absent": 1,
      "leave": 0,
      "marked": true,
      "formatted": "P: 3 / A: 1 / L: 0"
    }
  ]
}
```

---

### Save Bulk Attendance

**POST** `/api/attendance/bulk`

Request body:

```json
{
  "date": "2025-11-22",
  "records": [
    {
      "userId": "6921c9ee5d67c52626f56576",
      "status": "present",
      "remark": ""
    },
    {
      "userId": "6921c9fb5d67c52626f56578",
      "status": "absent",
      "remark": "Sick leave"
    }
  ]
}
```

Response:

```json
{
  "message": "Attendance updated successfully"
}
```
