import express from 'express';
import Book from '../models/BookModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';

const bookRouter = express.Router();

bookRouter.get('/', async (req, res) => {
  const books = await Book.find();
  res.send(books);
});

bookRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newBook = new Book({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      author: 'author name',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    const book = await newBook.save();
    res.send({ message: 'Book Created', book });
  })
);

bookRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (book) {
      book.name = req.body.name;
      book.slug = req.body.slug;
      book.price = req.body.price;
      book.image = req.body.image;
      book.category = req.body.category;
      book.author = req.body.author;
      book.countInStock = req.body.countInStock;
      book.description = req.body.description;
      await book.save();
      res.send({ message: 'Book Updated' });
    } else {
      res.status(404).send({ message: 'Book Not Found' });
    }
  })
);

const PAGE_SIZE = 3;

bookRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const books = await Book.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countBooks = await Book.countDocuments();
    res.send({
      books,
      countBooks,
      page,
      pages: Math.ceil(countBooks / pageSize),
    });
  })
);

bookRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const books = await Book.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countBooks = await Book.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      books,
      countBooks,
      page,
      pages: Math.ceil(countBooks / pageSize),
    });
  })
);

bookRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Book.find().distinct('category');
    res.send(categories);
  })
);

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
