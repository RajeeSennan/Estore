import React from 'react';

export default function Approval(props) {
  const isApproved = props.isApproved;
  if (isApproved === 0) {
    return <td>Not Approved </td>;
  } else if (isApproved === 1) {
    return <td> Approved </td>;
  } else {
    return <td> Denied </td>;
  }
}
