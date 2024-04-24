const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// List Of smaple Books
let books = [
    {
        isbn: '978-1-25-902998-1',
        title: 'Artificial Intelligence',
        author: 'Deepak Khemani',
        reviews: {person1:"Good",person2:"Need Some Improvemnt"}
    },
    {
        isbn: '1-25-902998-0',
        title: 'Machine Learning',
        author: 'Paschim Vihar',
        reviews: {peson1:"Fine",person2:"New Domain Knowledge"}
    }
];

let users = [];

// Middleware
app.use(bodyParser.json());

// secret key for JWT
const JWT_SECRET = 'fingerPrint';

// Middleware to authenticate user using JWT
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};


// Get the book list available in the shop
app.get('/books', (req, res) => {
    res.json(books);
});

// Get the books based on ISBN
app.get('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(book => book.isbn === isbn);
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

// Get all books by author
app.get('/books/author/:author', (req, res) => {
    const author = req.params.author;
    const authorBooks = books.filter(book => book.author === author);
    res.json(authorBooks);
});

// Get all books based on title
app.get('/books/title/:title', (req, res) => {
    const title = req.params.title;
    const titleBooks = books.filter(book => book.title === title);
    res.json(titleBooks);
});

// Get book review
app.get('/books/:isbn/reviews', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(book => book.isbn === isbn);
    if (book) {
        res.json(book.reviews);
    } else {
        res.status(404).send('Book not found');
    }
});

// Register new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const newUser = { username, password };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
});

// Login as a registered user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        const token = jwt.sign({ user: username }, JWT_SECRET);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});


// Add/Modify a book review
app.post('/books/:isbn/reviews', authenticateUser, (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const user = req.user;
    const book = books.find(book => book.isbn === isbn);
    if (book) {
        const userReviewIndex = book.reviews.findIndex(review => review.user === user);
        if (userReviewIndex !== -1) {
            // Modify review if it already exists
            book.reviews[userReviewIndex].review = review;
        } else {
            // Add new review
            book.reviews.push({ user, review });
        }
        res.status(201).json({ message: 'Review added/modified successfully' });
    } else {
        res.status(404).send('Book not found');
    }
});

// Delete book review added by that particular user
app.delete('/books/:isbn/reviews', authenticateUser, (req, res) => {
    const isbn = req.params.isbn;
    const user = req.user;
    const book = books.find(book => book.isbn === isbn);
    if (book) {
        const userReviewIndex = book.reviews.findIndex(review => review.user === user);
        if (userReviewIndex !== -1) {
            book.reviews.splice(userReviewIndex, 1);
            res.json({ message: 'Review deleted successfully' });
        } else {
            res.status(404).send('Review not found');
        }
    } else {
        res.status(404).send('Book not found');
    }
});

//Get all books - Using async/await
const getAllBooks = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 1000);
    });
};

app.get('/all-books', async (req, res) => {
    try {
        const allBooks = await getAllBooks();
        res.json(allBooks);
    } catch (error) {
        res.status(500).send('Error fetching books');
    }
});

// Search by ISBN - Using Promises
const searchByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        const book = books.find(book => book.isbn === isbn);
        if (book) {
            resolve(book);
        } else {
            reject('Book not found');
        }
    });
};

app.get('/search/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    searchByISBN(isbn)
        .then(book => res.json(book))
        .catch(error => res.status(404).send(error));
});

// Search by Author
app.get('/search/author/:author', (req, res) => {
    const author = req.params.author;
    const authorBooks = books.filter(book => book.author === author);
    res.json(authorBooks);
});

// Search by Title
app.get('/search/title/:title', (req, res) => {
    const title = req.params.title;
    const titleBooks = books.filter(book => book.title === title);
    res.json(titleBooks);
});


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
