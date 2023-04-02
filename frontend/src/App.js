import data from './data';
function App() {
  return (
    <div>
      <header>
        <a href="/">eStore for Books</a>
      </header>
      <main>
        <h1>featured Products</h1>
        <div className="books">
          {data.books.map((book) => (
            <div className="book" key={book.id}>
              <a href={`/book/${book.id}`}>
                <img src={book.image} alt={book.name} />
              </a>
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
      </main>
    </div>
  );
}

export default App;
