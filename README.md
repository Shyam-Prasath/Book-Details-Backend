# Book Details Backend

This repository contains the backend code for a book details application. It provides RESTful API endpoints for managing book data, including CRUD operations for books and user authentication.

## Features

- Retrieve a list of all books available in the bookshop
- Search for specific books by ISBN, author, or title
- Retrieve reviews/comments for specified books
- Register as a new user
- Login to the application
- Add, modify, or delete book reviews (for logged-in users)
- Secure authentication using JSON Web Tokens (JWT)

## Technologies Used

- Node.js
- Express.js
- JSON Web Tokens (JWT) for authentication

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

 git clone https://github.com/Shyam-Prasath/Book-Details-Backend

2. Install dependencies:

npm install

3. Start the server:

npm start

4. The server will start running on http://localhost:3000 by default.

## API Endpoints

- GET /books: Retrieve a list of all books
- GET /books/:isbn: Get book details by ISBN
- GET /books/author/:author: Get books by author
- GET /books/title/:title: Get books by title
- GET /books/:isbn/reviews: Get reviews for a book by ISBN
- POST /register: Register a new user
- POST /login: Login as a registered user
- POST /books/:isbn/reviews: Add or modify a review for a book
- DELETE /books/:isbn/reviews: Delete a review for a book

