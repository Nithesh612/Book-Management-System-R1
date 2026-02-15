# Book Management System – R1

A full-stack Book Management System that performs complete CRUD (Create, Read, Update, Delete) operations using a RESTful API to manage book records efficiently.

---

## Overview

This application allows users to add, view, update, delete, and search books.  
It demonstrates practical implementation of full-stack development using the MERN stack and clean component-based architecture.

---

## Tech Stack

- **Frontend:** Next.js (App Router), JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL  
- **API Communication:** Fetch API  
- **Version Control:** Git & GitHub
  
---

## Key Features

- Add new books with details  
- View all books dynamically  
- Update existing book records  
- Delete book entries  
- RESTful API integration  
- Responsive and structured UI  

---

## Project Structure

```
Book-Management-System-R1/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── app/
│   │       ├── book_create/
│   │       ├── book_details/[id]/
│   │       ├── book_edit/[id]/
│   │       ├── book_read/
│   │       ├── layout.js
│   │       ├── page.js
│   │       └── globals.css
├── package.json
└── README.md
```

---

## Installation & Setup

### 1. Clone the Repository

```
git clone https://github.com/Nithesh612/Book-Management-System-R1.git
```

### 2. Navigate to the Project Folder

```
cd Book-Management-System-R1
```

### 3. Install Dependencies

Backend:

```
cd backend
npm install
```

Frontend:

```
cd frontend
npm install
```

### 4. Run the Application

Backend:

```
npm start
```

Frontend:

```
npm start
```

---

## 🔗 API Endpoints

| Method | Endpoint         | Description        |
|--------|------------------|-------------------|
| GET    | /api/books       | Get all books     |
| POST   | /api/books       | Add a new book    |
| PUT    | /api/books/:id   | Update a book     |
| DELETE | /api/books/:id   | Delete a book     |

---

## What This Project Demonstrates

- Designing RESTful APIs using Express.js  
- Connecting MySQL with Node.js  
- Handling dynamic routing in Next.js  
- Consuming REST APIs using Fetch  
- Implementing full CRUD operations  

---
