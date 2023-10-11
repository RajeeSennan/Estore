import axios from 'axios';
import React, { useContext, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function ApprovalButton(props) {
  const isApproved = props.isApproved;
  const id = props.id;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (value) => {
    // e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/volunteers/approve',
        {
          value,
          id,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });

      toast.success('Volunteer updated successfully');
    } catch (err) {
      dispatch({
        type: 'UPDATE_FAIL',
      });
      toast.error(getError(err));
    }
  };

  if (isApproved === 0) {
    return (
      <td>
        <Button type="button" variant="light" onClick={() => submitHandler(1)}>
          {' '}
          Approve{' '}
        </Button>
        &nbsp;&nbsp;
        <Button type="button" variant="light" onClick={() => submitHandler(2)}>
          {' '}
          Deny{' '}
        </Button>
      </td>
    );
  } else if (isApproved === 1) {
    return (
      <td>
        {' '}
        <Button type="button" variant="light" onClick={() => submitHandler(2)}>
          {' '}
          Deny{' '}
        </Button>{' '}
      </td>
    );
  } else {
    return (
      <td>
        {' '}
        <Button type="button" variant="light" onClick={() => submitHandler(1)}>
          {' '}
          Approve{' '}
        </Button>{' '}
      </td>
    );
  }
}
