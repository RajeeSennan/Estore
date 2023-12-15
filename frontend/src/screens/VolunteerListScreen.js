import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import Approval from '../components/Approval';
import ApprovalButton from '../components/ApprovalButton';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
       return { ...state, volunteerList: action.payload, loading: false };
      //return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function VolunteerListScreen() {
  //const { state } = useContext(Store);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { volunteerList } = state;
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      error: '',
       
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/volunteers/all`);
        ctxDispatch({ type: 'VOLUNTEERLIST_FETCH', payload: data });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };

    fetchData();
  }, [ctxDispatch]);

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {volunteerList.map((volunteer) => (
              <tr key={volunteer.volunteerId}>
                <td>{volunteer.name}</td>
                <td>{volunteer.email}</td>
                <td>{volunteer.volunteerDays} </td>
                <td>{volunteer.volunteerTime}</td>
                {<Approval isApproved={volunteer.isApproved} />}
                {
                  <ApprovalButton
                    isApproved={volunteer.isApproved}
                    id={volunteer.volunteerId}
                  />
                }
                 <td>
                    {' '}
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/admin/email/${volunteer.email}`);}}
                    >
                      email
                    </Button>
                  </td>
                {volunteer.isApproved === 1 ? (
                  <td>
                    {' '}
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/admin/listenerSelect/${volunteer.volunteerId}`);}}
                    >
                      Add Listeners
                    </Button>
                  </td>
                  
                ) : (
                  <td>&nbsp;</td>                 
                )}
                 {volunteer.isApproved === 1 ? (
                  <td>                    
                    {' '}
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/admin/getListener/${volunteer.volunteerId}`);}}
                    >
                      Show Listeners
                    </Button>
                  </td>
                  
                ) : (
                  <td>&nbsp;</td>                 
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
