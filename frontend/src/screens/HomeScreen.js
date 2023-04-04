import data from '../data';
import {Link} from 'react-router-dom'

function HomeScreen() {
  return (
    <div>
      <h1>featured Products</h1>
      <div className="books">
        {data.books.map((book) => (
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
        ))}
      </div>
    </div>
  );
}

export default HomeScreen;
