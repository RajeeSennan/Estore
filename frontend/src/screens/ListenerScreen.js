import React, { useContext, useEffect, useReducer } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Store } from '../Store';
import axios from 'axios';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

export default function ListenerScreen() {
    const reducer = (state, action) => {
        switch (action.type) {
          case 'FETCH_REQUEST':
            return { ...state, loading: true };
          case 'FETCH_SUCCESS':
            return { ...state, listener: action.payload, loading: false };
          case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };        
          default:
            return state;
        }
      };
    const params = useParams();
    const { id: listenerId } = params;

    const { state } = useContext(Store);
  const { listenerInfo } = state;
  const [{ loading, error, listener }, dispatch] = useReducer(reducer, {
    listener: {},
    loading: true,
    error: '',
  });

    

    useEffect(() => {
        const fetchListener = async () => {
          try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(`/api/listeners/${listenerId}`, {
              headers: { authorization: `Bearer ${listenerInfo.token}` },
            });
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
          } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
          }
        };
        fetchListener()
    },[listenerId, listenerInfo]);
        
  return loading ? (<LoadingBox />)
  :error ? (<MessageBox variant="danger">{error}</MessageBox>)
  :(
    <div>
         <Helmet>
                <title>{listener.name}</title>
              </Helmet>   
              
         <Row>  
            <Col md={6}>
                <Row>
                    <Col><h2> Hello {listener.name}, Welcome to Reading Session!</h2></Col>                   
               </Row>
               <Row>
               <Col>
               <h3>Explore books from our site</h3>
               <Link to="/" className="btn btn-primary" >Explore Books</Link>
               </Col>
               </Row>
                </Col> 
               
        <Col md={6}>
            <h2>Your Profile</h2>
          <ListGroup variant="flush">
            <ListGroup.Item>
                       
              <h4>Name: {listener.name}</h4>
            </ListGroup.Item>           
            <ListGroup.Item>
              <h4>Age: {listener.age}</h4>
            </ListGroup.Item>           
            <ListGroup.Item>
              <h4>Grade: {listener.grade}</h4>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>School: {listener.school}</h4>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>email: {listener.email}</h4>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>ListeningDays: {listener.listeningDays}</h4>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>ListeningTime: {listener.listeningTime}</h4>
            </ListGroup.Item>
          </ListGroup>
        </Col>        
      </Row>
      
    </div>
  )
}
