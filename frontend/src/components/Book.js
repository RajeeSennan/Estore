import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { useContext } from 'react';
import { Store } from '../Store';
import axios from 'axios';

function Book(props) {
  const { book } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === book._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/books/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Book is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  return (
    <Card>
      <Link to={`/book/${book.slug}`}>
        <img src={book.image} alt={book.name} className="card-img-top" />
      </Link>
      <Card.Body>
        <Link to={`/book/${book.slug}`}>
          <p>{book.name}</p>
        </Link>
        <Rating rating={book.rating} numReviews={book.numReviews} />
        <Card.Text>${book.price}</Card.Text>
        {book.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(book)}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Book;
