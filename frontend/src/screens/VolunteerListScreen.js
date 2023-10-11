import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import Approval from '../components/Approval';
import ApprovalButton from '../components/ApprovalButton';
import  Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, volunteerUserInfo: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function VolunteerListScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, volunteerUserInfo }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      error: '',
      volunteerUserInfo: [],
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/volunteers/all`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        localStorage.setItem('volunteerUserInfo', JSON.stringify(data));
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Volunteers</title>
      </Helmet>
      <h1>Volunteers</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>VOLUNTEER DAYS</th>
              <th>VOLUNTEER TIME</th>
              <th>APPROVAL STATUS</th>
              <th>ACTIONS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {volunteerUserInfo.map((volunteer) => (
              <tr key={volunteer.volunteerId}>
                <td>{volunteer.name}</td>
                <td>{volunteer.email}</td>
                <td>{volunteer.volunteerDays} </td>
                <td>{volunteer.volunteerTime}</td>
                {<Approval isApproved={volunteer.isApproved} />}
                {<ApprovalButton isApproved={volunteer.isApproved} id={volunteer.volunteerId} />}
                {volunteer.isApproved === 1?( <td> <Button type="button" variant="light">Add Listener(s)</Button></td>)
                :(
                <td>&nbsp;</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}