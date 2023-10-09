import React from 'react';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

export default function Service() {
  return (
    <div>
      <Helmet>
        <title>Service Information</title>
      </Helmet>
      <div className="my-3">
        <h2>Do you want to listen to stories read by our volunteers?</h2>
        <p>
          The reading program is to encourage children to read books and instill
          the reading habit who are under 16 years old{' '}
        </p>
        <p>
          {' '}
          Parent guidance is must for children to be part of this porgram.
          Parents receive all communications from the reading program
          coordinator to reach the program's goal very efficeint and effective
          for the children in listening to book reading.{' '}
        </p>
        <img
          className="img-small"
          src={'/images/reading-a-book-vecto.jpg'}
          alt="reading a book"
        ></img>
        <Link to={'/listenersignup'} className="btn btn-primary">
          Join to Read!
          {/* <Button variant="info"> Join to Read! </Button> */}
        </Link>
      </div>
      <div></div>
      <div className="my-3">
        <h2>Volunteer Service</h2>
        <p>
          Sign up for voluteer program to read books to children and earn badges
          for the services!
        </p>
        <h3> Eligibility</h3>
        <ul>
          <li> Must be 16 years old or above </li>
          <li> Apply for Volunteering</li>
          <li> Admin reviews your application</li>
          <li>
            {' '}
            An email notification will be sent abut your volunteer
            acceptance/Rejection
          </li>
        </ul>
        <h3> How volunteering works?</h3>
        <ul>
          <li> You need to provide your availability for the reading books</li>
          <li>
            {' '}
            you will be assigned to a child/children to read books on your
            available time
          </li>
          <li>
            {' '}
            You will receive an email with the details of the child/children,
            the zoom meeting link, and a link to ebook{' '}
          </li>
          <li>
            {' '}
            You will be reading book to child/children on the specified time
          </li>
          <li>
            {' '}
            After completion of reading books volunteer will receive a badge and
            earn voulteer hours!
          </li>
        </ul>

        <h3> Use of Volunteer badge and hours</h3>
        <p>
          {' '}
          The badges and hours earned from the volunteering activites can be put
          in the college application to show your social service and also fills
          the extra curricular activities.
        </p>
        <img
          className="img-small"
          src={'/images/volunteer.jpg'}
          alt="volunteering"
        ></img>
        <Link to={'/volunteersignup'} className="btn btn-primary">
        Volunteer Sign Up         
        </Link>
        {/* <Button variant="info"> Volunteer Sign Up </Button> */}
      </div>
    </div>
  );
}
