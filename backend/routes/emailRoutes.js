import Mailgun from 'mailgun-js';
import mg from 'mailgun-js';
import dotenv from 'dotenv';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';

const emailRouter = express.Router();

dotenv.config();
const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

emailRouter.post('/', async (req, res) => {
  const { email, subject, message } = req.body;
  mailgun()
    .messages()
    .send(
      {
        from: 'Estore System <rajeesennan@gmail.com>',
        to: `${email}`,
        subject: `${subject}`,
        html: `<p>${message}</p>`,
      },
      (error, body) => {
        if(error){

            console.log(error);
            res.status(500).send({message: 'Error in sending email'});
        }else{
            console.log(body);
            res.status(200).send({message: 'Email sent successfully'});
        }
      }
    );
});

export default emailRouter;
