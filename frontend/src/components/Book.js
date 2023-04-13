import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Rating from './Rating';

function Book(props) {
  const { book } = props;
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
        <Button>Add to cart</Button>
      </Card.Body>
    </Card>
  );
}
export default Book;
