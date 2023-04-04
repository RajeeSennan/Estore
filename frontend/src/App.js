import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import BookScreeen from './screens/BookScreen';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <Link to="/">eStore for Books</Link> {/* used for page not refresh*/}
        </header>
        <main>
          <Routes>
            <Route path="/book/:id" element={<BookScreeen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
