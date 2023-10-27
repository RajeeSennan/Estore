import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import Button from 'react-bootstrap/esm/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state,  loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function UserListScreen() {
  const { state, dispatch: ctxDispatch} = useContext(Store);
  const { userInfo  } = state;
  const {volunteerUserInfo} = state;
  const navigate = useNavigate();

  const [{ loading, error}, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/users/onlyUsers`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        ctxDispatch({ type: 'VOLUNTEERUSER_FETCH', payload: data });
        localStorage.setItem('volunteerUserInfo', JSON.stringify(data));
        console.log(volunteerUserInfo)
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };

    fetchData();
  }, [userInfo, dispatch, ctxDispatch]);

  

  return (
    <div>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <h1>Users</h1>
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
              <th>IS VOLUNTEER?</th>             
            </tr>
          </thead>
          <tbody>
            {volunteerUserInfo.map((user) => (
              <tr key={user.userId}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.volunteerId === 'NULL' ? 'NO' : 'YES'} </td>
               

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
    </div>
  );
}
