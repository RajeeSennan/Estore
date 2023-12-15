import React, { useContext, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { useParams } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'SEND_REQUEST':
      return { ...state, loading: true };
    case 'SEND_SUCCESS':
      return { ...state, loading: false };
    case 'SEND_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function EmailScreen() {
  const params = useParams();
  const { emailParam } = params;
  //const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  console.log('The email ' + emailParam);
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
  });

  const submitHandler = async (e) => {
    //console.log('The email2 ' + email);
    e.preventDefault();
    if (!emailParam || !subject || !message) {
      return toast.error('Please fill email, subject and message');
    }
    const email = emailParam;
    try {
      dispatch({ type: 'SEND_REQUEST' });
      const { data } = await axios.post(
        `/api/email`,
        {
          email,
          subject,
          message,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'SEND_SUCCESS',
      });

      toast.success(data.Message);
    } catch (err) {
      dispatch({
        type: 'SEND_FAIL',
      });
      toast.error(getError(err));
    }
  };
  return (
    <div className="container small-container">
      {/* <ToastContainer position='bottom-center' limit={1}/> */}
      <Helmet>
        <title>Email Notifcation</title>
      </Helmet>
      <h1 className="my-3">Email Notifcation</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={emailParam}
            // onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="subject">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="Message">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
}
