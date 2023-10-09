import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { useNavigate } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };    

    default:
      return state;
  }
};
export default function VolunteerProfile() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { volunteerInfo } = state;
  const { userInfo} =state;

  const [volunteerTime, setVolunteerTime] = useState(volunteerInfo.volunteerTime);
  const [volunteerDays, setVolunteerDays] = useState(volunteerInfo.volunteerDays);
  const [volunteerId, setVolunteerId] = useState(volunteerInfo._id);
  
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {   
    loadingUpdate: false,
  });

  

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/volunteers/profile',
        {
          volunteerId,
          volunteerTime,
          volunteerDays          
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'VOLUNTEER_SIGNIN', payload: data });
      localStorage.setItem('volunteerInfo', JSON.stringify(data));
      toast.success('Profile updated successfully');
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
          <title>Volunteer Profile</title>
        </Helmet>
        <h1 className="my-3">Volunteer Profile</h1>
        <form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="volunteerTime">
            <Form.Label>Volunteer Time</Form.Label>
            <Form.Control
              value={volunteerTime}
              onChange={(e) => setVolunteerTime(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="volunteerDays">
            <Form.Label>Volunteer Days</Form.Label>
            <Form.Control
              type="volunteerDays"
              value={volunteerDays}
              onChange={(e) => setVolunteerDays(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button type="submit">Update</Button>
            </div>
          </form>
      
    </div>
  )
}
