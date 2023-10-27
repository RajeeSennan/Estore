import {
  isAuth,
  isAdmin,
  generateToken,
  generateServiceToken,
} from '../utils.js';
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
  const listener = await Listener.find();
  res.send(listener);
});

listenerRouter.get('/active', async (req, res) => {
  const listener = await Listener.find({ isActive: true, volunteer: null });
  res.send(listener);
});

listenerRouter.get('/:id', async (req, res) => {
  const listener = await Listener.findById(req.params.id);
  if (listener) {
    res.send(listener);
  } else {
    res.status(404).send({ message: 'Listener Not Found' });
  }
});

listenerRouter.get('/forVolunteer/:volunteerId', async (req, res) => {
  const listener = await Listener.find({ volunteer: req.params.volunteerId });
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

listenerRouter.put(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const listener = await Listener.findById(req.body.listenerId);
    if (listener) {
      listener.volunteer = req.body.volunteerId;
      listener.name = listener.name;
      listener.age = listener.age;
      listener.school = listener.school;
      listener.grade = listener.grade;
      listener.listeningDays = listener.listeningDays;
      listener.listeningTime = listener.listeningTime;
      listener.email = listener.email;

      const updatedListener = await listener.save();

      // res.send({
      //   _id: updatedListener._id,
      //   name: updatedListener.name,
      //   age: updatedListener.age,
      //   school: updatedListener.school,
      //   grade: updatedListener.grade,
      //   listeningDays: updatedListener.listeningDays,
      //   listeningTime: updatedListener.listeningTime,
      //   completedCount: updatedListener.completedCount,
      //   email: updatedListener.email,
      // });
      if (updatedListener) {
        const listener = await Listener.find({
          isActive: true,
          volunteer: null,
        });
        res.send(listener);
      }
    } else {
      res.status(404).send({ message: 'listener not found' });
    }
  })
);

export default listenerRouter;
