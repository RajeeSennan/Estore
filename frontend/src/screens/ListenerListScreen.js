import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, listenerList: action.payload, loading: false };
    //return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loading: true };
    case 'UPDATE_SUCCESS':
      return { ...state, listenerList: action.payload, loading: false };
    case 'UPDATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function ListenerListScreen() {
  //const { state } = useContext(Store);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  //const { listenerList } = state;
  const { userInfo } = state;

  const [{ loading, error, listenerList }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    listenerList: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/listeners');
        console.log('the data is ' + data[0]);
        // ctxDispatch({ type: 'LISTENERLIST_FETCH', payload: data });
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
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      ctxDispatch({ type: 'LISTENERLIST_FETCH', payload: data });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Added Successfully!');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <Helmet>
        <title>Listeners</title>
      </Helmet>
      <h2>Listeners</h2>
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
              <th>AGE</th>
              <th>GRADE</th>
              <th>SCHOOL</th>
              <th>AVAILABLE DAYS</th>
              <th>AVAILABLE TIME</th>
              <th>COMPLETED READING</th>
              <th>IS VERIFIED?</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listenerList.map((listener) => (
              <tr key={listener._id}>
                <td>{listener.name}</td>
                <td>{listener.email}</td>
                {/* <td>{listener.volunteer === 'NULL' ? 'NO' : 'YES'} </td> */}
                <td>{listener.age}</td>
                <td>{listener.grade}</td>
                <td>{listener.school}</td>
                <td>{listener.listeningDays}</td>
                <td>{listener.listeningTime}</td>
                <td>{listener.completedCount}</td>
                <td>{listener.isVerified.toString()}</td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    value={listener._id}
                    onClick={submitHandler}
                  >
                    Accept
                  </Button>
                </td>

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
