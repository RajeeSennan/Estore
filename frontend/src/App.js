import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import BookScreeen from './screens/BookScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import SearchScreen from './screens/SearchScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import BookListScreen from './screens/BookListScreen';
import BookEditScreen from './screens/BookEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import ServiceScreen from './screens/ServiceScreen';
import AdminRoute from './components/AdminRoute';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import ListenerSignupScreen from './screens/ListenerSignupScreen';
import ListenerScreen from './screens/ListenerScreen';
import VolunteerSignupScreen from './screens/VolunteerSignupScreen';
import VolunteerScreen from './screens/VolunteerScreen';
import VolunteerProfile from './screens/VolunteerProfile';
import EditUserScreen from './screens/EditUserScreen';
import VolunteerListScreen from './screens/VolunteerListScreen';
import ListenerListScreen from './screens/ListenerListScreen';
import ListenerSelectScreen from './screens/ListenerSelectScreen';
import VolunteerListenerScreen from './screens/VolunteerListenerScreen';
import EmailScreen from './screens/EmailScreen';
import VolunteerReportScreen from './screens/VolunteerReportScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    localStorage.removeItem('volunteerInfo');
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [volunteer, setVolunteer] = useState('');
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/books/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();

    if (userInfo === null) {
      return;
    } else if (!userInfo.isAdmin) {
      const fetchVolunteer = async () => {
        try {
          const { data } = await axios.get(
            `/api/volunteers/user/${userInfo._id}`
          );
          ctxDispatch({ type: 'VOLUNTEER_SIGNIN', payload: data });
          localStorage.setItem('volunteerInfo', JSON.stringify(data));
          setVolunteer(data);
        } catch (err) {
          //toast.error(getError(err));
        }
      };
      fetchVolunteer();
    }
    //fetchCategories();
  }, [userInfo, ctxDispatch]);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                varaint="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>eStore</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  <Link to="/service" className="nav-link">
                    Service
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History </NavDropdown.Item>
                      </LinkContainer>
                      {volunteer ? (
                        <LinkContainer to="/volunteerReport">
                          <NavDropdown.Item>Volunteer Report </NavDropdown.Item>
                        </LinkContainer>
                      ) : (
                        ''
                      )}
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/books">
                        <NavDropdown.Item>Books</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/volunteers">
                        <NavDropdown.Item>Volunteers</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/listeners">
                        <NavDropdown.Item>Listeners</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  // to={`/searchcategory=${category}`}
                  to={{
                    pathname: '/search',
                    search: `category=${category}`,
                  }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/book/:slug" element={<BookScreeen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/service" element={<ServiceScreen />} />
              <Route path="/listener/:id" element={<ListenerScreen />} />
              <Route path="/volunteer/:id" element={<VolunteerScreen />} />
              <Route
                path="/listenersignup"
                element={<ListenerSignupScreen />}
              />
              <Route
                path="/volunteersignup"
                element={<VolunteerSignupScreen />}
              />
              <Route path="/volunteer" element={<VolunteerScreen />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/volunteerprofile"
                element={
                  <ProtectedRoute>
                    <VolunteerProfile />
                  </ProtectedRoute>
                }
              />

              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/volunteerReport"
                element={
                  <ProtectedRoute>
                    <VolunteerReportScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/books"
                element={
                  <AdminRoute>
                    <BookListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/book/:id"
                element={
                  <AdminRoute>
                    <BookEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/volunteers"
                element={
                  <AdminRoute>
                    <VolunteerListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/listeners"
                element={
                  <AdminRoute>
                    <ListenerListScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/listenerSelect/:volunteerId"
                element={
                  <AdminRoute>
                    <ListenerSelectScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/getListener/:volunteerId"
                element={
                  <AdminRoute>
                    <VolunteerListenerScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/editUser/:userId"
                element={
                  <AdminRoute>
                    <EditUserScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/email/:emailParam"
                element={
                  <AdminRoute>
                    <EmailScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
