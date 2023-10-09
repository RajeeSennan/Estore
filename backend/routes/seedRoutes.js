import express from 'express';
import Book from '../models/BookModel.js';
import User from '../models/UserModel.js';
import Listener from '../models/ListenerModel.js';
import data from '../data.js';
import listenerdata from '../listenerdata.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Book.deleteMany({});
  const createdBooks = await Book.insertMany(data.books);

  await User.deleteMany({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdBooks, createdUsers });
});

seedRouter.get('/listener', async (req, res) => {
  await Listener.deleteMany({});
  const createdListners = await Listener.insertMany(listenerdata.listener);

  res.send({ createdListners });
});

export default seedRouter;
