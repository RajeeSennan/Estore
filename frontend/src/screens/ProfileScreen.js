import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, volunteerInfo: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [user, setUser] = useState(userInfo._id);

  const [{ loadingUpdate, volunteerInfo }, dispatch] = useReducer(reducer, {
    volunteerInfo: null,
    loadingUpdate: false,
  });

  useEffect(() => {
    const fetchListener = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/volunteers/user/${user}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        ctxDispatch({ type: 'VOLUNTEER_SIGNIN', payload: data });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        localStorage.setItem('volunteerInfo', JSON.stringify(data));
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchListener();
  }, [user, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({
        type: 'UPDATE_FAIL',
      });
      toast.error(getError(err));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        {volunteerInfo ? (
          <div className="mb-3">
            <Button type="submit">Update</Button>
            <p></p>
            Update volunteer info?{' '}
            <Link to={'/volunteerprofile'}> Go to Volunteer profile</Link>
          </div>
        ) : (
          <div className="mb-3">
            <Button type="submit">Update</Button>
          </div>
        )}
      </form>
    </div>
  );
}
