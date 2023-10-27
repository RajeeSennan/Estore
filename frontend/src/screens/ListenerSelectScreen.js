import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Store } from '../Store';
import axios from 'axios';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, listeners: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, listeners: action.payload, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function ListenerSelectScreen() {
  const params = useParams();
  const { volunteerId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, listeners }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      error: '',
      listeners: [],
    }
  );

  //const[litenerId, setListenerId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/listeners/active');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, []);

  const submitHandler = async (e) => {
    // e.preventDefault();
    //setListenerId(e.target.value);
    try {
      const listenerId = e.currentTarget.value;
      //console.log("The Key is :" + value);
      console.log('The user is :' + userInfo.token);
      const { data } = await axios.put(
        '/api/listeners/admin',
        {
          listenerId,
          volunteerId,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'UPDATE_SUCCESS', payload: data });
      toast.success('Added Successfully!');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };
  return (
    <div>
      <Helmet>
        <title>Add Listener</title>
      </Helmet>
      <h2>Add Listener to Volunteer: {volunteerId}</h2>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>AGE</th>
              <th>GRADE</th>
              <th>SCHOOL</th>
              <th>AVAILABLE DAYS</th>
              <th>AVAILABLE TIME</th>
              <th>COMPLETED READING</th>
            </tr>
          </thead>
          <tbody>
            {listeners.map((listener) => (
              <tr key={listener._id}>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    value={listener._id}
                    onClick={submitHandler}
                  >
                    ADD
                  </Button>
                </td>
                <td>{listener.name}</td>
                <td>{listener.email}</td>
                {/* <td>{listener.volunteer === 'NULL' ? 'NO' : 'YES'} </td> */}
                <td>{listener.age}</td>
                <td>{listener.grade}</td>
                <td>{listener.school}</td>
                <td>{listener.listeningDays}</td>
                <td>{listener.listeningTime}</td>
                <td>{listener.completedCount}</td>

                {/* <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => navigate(`/admin/editUser/${user.userId}`)}
                  >
                    View
                  </Button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <Link to={'/admin/volunteers'}> Go to Volunteers</Link>
      </div>
    </div>
  );
}
