import React from 'react'
import {  useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';



export default function ListenerSignupScreen(){
    const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [listeningTime, setlisteningTime] = useState('');  
  const [listeningDays, setlisteningDays] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { listenerInfo } = state;
  

 const navigate = useNavigate();
 // const { service } = useLocation();
 // const redirectInUrl = new URLSearchParams(service).get('redirect');
  //const redirect = redirectInUrl ? redirectInUrl : '/';

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      const { data } = await Axios.post('/api/listeners/signup', {
        name,
        email,
        age,
        school,
        grade,
        listeningDays,
        listeningTime,
        
      });
      ctxDispatch({ type: 'LISTENER_SIGNIN', payload: data });
      localStorage.setItem('listenerInfo', JSON.stringify(data));
      navigate(`/listener/${data._id}`);
    } catch (err) {
      toast.error(getError(err));
    }
  };
  // useEffect(() => {
  //   if (listenerInfo) {
  //     navigate(redirect);
  //   }
  // }, [navigate, redirect, listenerInfo]);


    return (
        <Container className="small-container">
          <Helmet>
            <title>Sign Up to Read with Us</title>
          </Helmet>
          <h1 className="my-3">Sign Up to Read with Us!</h1>
          <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control required onChange={(e) => setName(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="age">
          <Form.Label>Age</Form.Label>
          <Form.Control required onChange={(e) => setAge(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="grade">
          <Form.Label>Grade</Form.Label>
          <Form.Control required onChange={(e) => setGrade(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="school">
          <Form.Label>School</Form.Label>
          <Form.Control required onChange={(e) => setSchool(e.target.value)} />
        </Form.Group>
      
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="listeningDays">
          <Form.Label>Days availability</Form.Label>
          <Form.Control required onChange={(e) => setlisteningDays(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="listeningTime">
          <Form.Label>Time availability</Form.Label>
          <Form.Control required onChange={(e) => setlisteningTime(e.target.value)} />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>

          </Form>
          
        </Container>
      );
}