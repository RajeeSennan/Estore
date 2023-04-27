import express from 'express';
import Book from '../models/BookModel.js';

const bookRouter = express.Router();

bookRouter.get('/', async (req, res) => {
  const books = await Book.find();
  res.send(books);
});

bookRouter.get('/slug/:slug', async (req, res) => {
  const book = await Book.findOne({ slug: req.params.slug });
  if (book) {
    res.send(book);
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
});

bookRouter.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    res.send(book);
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
});
export default bookRouter;
