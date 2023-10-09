import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function VolunteerSignupScreen() {
  const [volunteerTime, setVolunteerTime] = useState('');
  const [volunteerDays, setVolunteerDays] = useState('');

  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/volunteersignup');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post(
        '/api/volunteers/signup',
        {
          volunteerDays,
          volunteerTime,
        },

        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );      
      ctxDispatch({ type: 'VOLUNTEER_SIGNIN', payload: data });
      localStorage.setItem('UserInfo', JSON.stringify(data.user));
      localStorage.setItem('VolunteerInfo', JSON.stringify(data));
      navigate(`/volunteer/${data._id}`);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return userInfo? (
    <Container className="small-container">
      <Helmet>
        <title>Volunteer Sign Up</title>
      </Helmet>
      <h1 className="my-3">        
        Hello {userInfo.name}, Sign Up to read Books to Children!
      </h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="VolunteerDays">
          <Form.Label>Days Availability</Form.Label>
          <Form.Control
            required
            onChange={(e) => setVolunteerDays(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="VolunteerTime">
          <Form.Label>Time Availability</Form.Label>
          <Form.Control
            required
            onChange={(e) => setVolunteerTime(e.target.value)}
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>
      </Form>
    </Container>
  ): [];
}
