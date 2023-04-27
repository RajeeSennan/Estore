import express from 'express';
import Book from '../models/BookModel.js';
import User from '../models/UserModel.js';
import data from '../data.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Book.deleteMany({});
  const createdBooks = await Book.insertMany(data.books);

  await User.deleteMany({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdBooks, createdUsers });
});

export default seedRouter;
