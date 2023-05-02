import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Book from '../components/Book.js';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox.js';
import MessageBox from '../components/MessageBox.js';

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
  // const [{ loading, error, books }, dispatch] = useReducer(logger(reducer), {
  //   books: [],
  //   loading: true,
  //   error: '',
  // });
  const [{ loading, error, books }, dispatch] = useReducer(reducer, {
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
      <Helmet>
        <title>eStore</title>
      </Helmet>
      <h1>featured Products</h1>
      <div className="books">
        {loading ? (
          <LoadingBox />
        ) : error ? (
         <MessageBox variant='danger'>{error}</MessageBox>
        ) : (
          <Row>
            {books.map((book) => (
              <Col key={book.slug} sm={6} md={4} lg={3} className="mb-3">
                <Book book={book}></Book>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
