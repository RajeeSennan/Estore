import React, { useContext, useState } from 'react'
import { Store } from '../Store'
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import  Button  from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';

export default function EditUserScreen() {

    const params = useParams();
    const { id: userId } = params;
    const {state, dispatch:ctxDispatch } = useContext(Store);
   
   

    const submitHandler = () => {

    }
  return (
    <div className="container small-container">
        <Helmet>
          <title>Edit User</title>
        </Helmet>
        <h1 className="my-3">Edit User</h1>
        
      
    </div>
  )
}
