import React, { useContext, useEffect, useReducer, useState } from 'react';
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
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false };
    case 'LISTENERFETCH_SUCCESS':
      return { ...state, loading: false, listener: action.payload };
    case 'FETCHVOL_REQUEST':
      return { ...state, loading: true };
    case 'VOLREPORTFETCH_SUCCESS':
      return { ...state, loading: false, volunteerReport: action.payload };
    case 'FETCHVOL_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function VolunteerReportScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { volunteerInfo, userInfo } = state;
  //const { userInfo} =state;

  const [{ loading, listener, volunteerReport }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      listener: {},
      volunteerReport: {},
    }
  );

  const [name, setListenerName] = useState(listener.name);
  const [age, setListenerAge] = useState(listener.age);
  const [grade, setListenerGrade] = useState(listener.grade);
  const [selectedBook, setSelectedBook] = useState(
    volunteerReport.selectedBook
  );
  const [readingStatus, setReadingStatus] = useState(
    volunteerReport.readingStatus
  );
  const [completedOn, setCompletedOn] = useState(volunteerReport.completedOn);

  useEffect(() => {
    const fetchListener = async () => {
      // console.log("The volunter ID : "+ volunteerInfo._id)
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `/api/listeners/forVolunteerOne/${volunteerInfo._id}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({ type: 'LISTENERFETCH_SUCCESS', payload: data });
        //console.log('The listener name: ' + listener[0].name);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchListener();
    const fetchVolunteerReport = async () => {
      try {
        dispatch({ type: 'FETCHVOL_REQUEST' });
        const { data } = await axios.get(
          `/api/volunteerReport/${volunteerInfo._id}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'VOLREPORTFETCH_SUCCESS', payload: data });
        //console.log('The listener name: ' + listener[0].name);
      } catch (err) {
        //dispatch({ type: 'FETCHVOL_FAIL', payload: getError(err) });
        //toast.error(getError(err))
      }
    };

    fetchVolunteerReport();
  }, [volunteerInfo, userInfo, ctxDispatch, listener]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const listenerId = listener._id;
    const volunteerId = volunteerInfo._id;
    try {
      const { data } = await axios.put(
        '/api/volunteerReport/update',
        {
          selectedBook,
          readingStatus,
          completedOn,
          listenerId,
          volunteerId,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
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
        <title>Volunteer Report</title>
      </Helmet>
      <h1 className="my-3">Volunteer Report</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Listener Name</Form.Label>
          <Form.Control
            value={listener.name}
            onChange={(e) => setListenerName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="age">
          <Form.Label>Listener Age</Form.Label>
          <Form.Control
            value={listener.age}
            onChange={(e) => setListenerAge(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="grade">
          <Form.Label>Listener Grade</Form.Label>
          <Form.Control
            value={listener.grade}
            onChange={(e) => setListenerGrade(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="books">
          <Form.Label>Selected Book</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={volunteerReport.selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="status">
          <Form.Label>Reading Status </Form.Label>
          <Form.Control
            value={volunteerReport.readingStatus}
            onChange={(e) => setReadingStatus(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="completedOn">
          <Form.Label>Completed On </Form.Label>
          <Form.Control
            value={volunteerReport.completedOn}
            onChange={(e) => setCompletedOn(e.target.value)}
            required
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
}
