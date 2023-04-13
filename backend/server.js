import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('connected to DB')
})
.catch((err) => {
  console.log(err.message);
});

const app = express();

app.get('/api/books', (req, res) => {
  res.send(data.books);
});


app.get('/api/books/slug/:slug', (req, res) => {
  const book = data.books.find((x) => x.slug === req.params.slug);
  if (book) {
    res.send(book);
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
});

app.get('/api/books/:id', (req, res) => {
  const book = data.books.find((x) => x._id === req.params.id);
  if (book) {
    res.send(book);
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
