import { isAuth, generateToken, generateServiceToken } from '../utils.js';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Listener from '../models/ListenerModel.js';

const listenerRouter = express.Router();

const listenerToken1 = (listener) => {
  name: listener.name;
  _id: listener._id;
  email: listener.email;
};

listenerRouter.get('/', async (req, res) => {
  const user = await Listener.find();
  res.send(user);
});

listenerRouter.get('/:id', async (req, res) => {
  const listener = await Listener.findById(req.params.id);
  if (listener) {
    res.send(listener);
  } else {
    res.status(404).send({ message: 'Listener Not Found' });
  }
});

//Get Listener
listenerRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    console.log(req.body.email);
    const listener = await Listener.findOne({ email: req.body.email });
    if (listener) {
      console.log('This listener already exist');

      const listenerToken = {
        name: listener.name,
        _id: listener._id,
        email: listener.email,
      };

      //if (bcrypt.compareSync( req.body.password, user.password)) {
      res.send({
        _id: listener._id,
        name: listener.name,
        age: listener.age,
        school: listener.school,
        grade: listener.grade,
        listeningDays: listener.listeningDays,
        listeningTime: listener.listeningTime,
        completedCount: listener.completedCount,
        email: listener.email,
        token: generateServiceToken(listenerToken),
        //volunteer: listener.volunteer,
      });
      return;
      // }
    }
    console.log(user.email);
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

listenerRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newListener = new Listener({
      name: req.body.name,
      age: req.body.age,
      grade: req.body.grade,
      school: req.body.school,
      listeningDays: req.body.listeningDays,
      listeningTime: req.body.listeningTime,
      //completedCount: req.body.completedCount,
      email: req.body.email,
      
    });
    const listener = await newListener.save();
    const listenerToken = {
        name: listener.name,
        _id: listener._id,
        email: listener.email,
      };

    res.send({
      _id: listener._id,
      name: listener.name,
      age: listener.age,
      school: listener.school,
      grade: listener.grade,
      listeningDays: listener.listeningDays,
      listeningTime: listener.listeningTime,
      completedCount: listener.completedCount,
      email: listener.email,
      token: generateServiceToken(listenerToken),
    });
  })
);

export default listenerRouter;
