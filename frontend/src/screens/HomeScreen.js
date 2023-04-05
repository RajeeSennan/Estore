import { useEffect, useReducer, useState } from 'react';
//import data from '../data';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, books: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, books }, dispatch] = useReducer(logger(reducer), {
    books: [],
    loading: true,
    error: '',
  });
  //const [books, setBooks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/books');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }

      //setBooks(result.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>featured Products</h1>
      <div className="books">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          books.map((book) => (
            <div className="book" key={book.id}>
              <Link to={`/book/${book.id}`}>
                <img src={book.image} alt={book.name} />
              </Link>
              <div className="book-info">
                <a href={`/book/${book.id}`}>
                  <p>{book.name}</p>
                </a>
                <p>
                  <strong>${book.price}</strong>
                </p>
              </div>
              <button>Add to cart</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
