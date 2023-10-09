import React, { useContext, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom';
import { Store } from '../Store';
import axios from 'axios';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Helmet } from 'react-helmet-async';
import { Col, Row } from 'react-bootstrap';

export default function VolunteerScreen() {
    const reducer = (state, action) => {
        switch (action.type) {
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

      const params = useParams();
    const { id: volunteerId } = params;

    const { state } = useContext(Store);
    const {userInfo} = state 
  const [{ loading, error, volunteerInfo }, dispatch] = useReducer(reducer, {
    volunteer: {},
    loading: true,
    error: '',
  });

    useEffect(() => {
        const fetchListener = async () => {
          try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(`/api/volunteers/${volunteerId}`, {
              headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
          } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
          }
        };
        fetchListener()
    },[volunteerId, userInfo]);


    return loading ? (<LoadingBox />)
    :error ? (<MessageBox variant="danger">{error}</MessageBox>)
    :(
        <div>
        <Helmet>
               <title>{volunteerInfo.name}</title>
             </Helmet>   
             <Row>  
            <Col md={6}>
            <h2> Hello  {volunteerInfo.name}, thanks for signing up for a volunteer service.</h2>
            <p> Your information will be reviewed and once your're approved for volunteering,  you will be receving an email from our admin with the listener details, ebook link 
                and the start date for the book.
            </p>
                </Col>
                </Row>
             </div>
             
  )
}
