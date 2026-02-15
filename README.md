# Book Management System – R1

A full-stack Book Management System that performs complete CRUD (Create, Read, Update, Delete) operations using a RESTful API to manage book records efficiently.

---

## Overview

This application allows users to add, view, update, delete, and search books.  
It demonstrates practical implementation of full-stack development using the MERN stack and clean component-based architecture.

---

## Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **API Handling:** Axios  
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
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│
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

## Learning Objectives

- Building RESTful APIs using Express.js  
- Connecting MongoDB with Mongoose  
- Managing React component state  
- Integrating frontend with backend using Axios  
- Structuring scalable full-stack applications  

---

## Author

**Nithesh Kumar R**  
GitHub: https://github.com/Nithesh612
