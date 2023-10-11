import { isAuth, generateToken } from '../utils.js';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import Volunteer from '../models/VolunteerModel.js';
import User from '../models/UserModel.js';

const volunteerRouter = express.Router();

volunteerRouter.get('/', async (req, res) => {
  const volunteer = await Volunteer.find();
  // for( const item of volunteer){

  // }
  res.send(volunteer);
});

volunteerRouter.get('/all', async (req, res) => {
  const volunteers = await Volunteer.find();

  const volunteerUsers = [];

  if (volunteers.length > 0) {
    for (var index in volunteers) {
      const user = await User.findOne({ _id: volunteers[index].user });

      console.log(user.name);
      const vu = new Object();
      vu.userId = user._id;
      vu.name = user.name;
      vu.email = user.email;
      vu.isApproved = volunteers[index].isApproved;
      vu.volunteerDays = volunteers[index].volunteerDays;
      vu.volunteerTime = volunteers[index].volunteerTime;
      vu.badgeCount = volunteers[index].badgeCount;
      vu.volunteerId = volunteers[index]._id;
      volunteerUsers.push(vu);
    }
  }

  res.send(volunteerUsers);
});

volunteerRouter.get('/delete', async (req, res) => {
  await Volunteer.deleteMany({});
  console.log('the volunteer are deleted!');
});

volunteerRouter.get('/:id', async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);
  if (volunteer) {
    const user = await User.findOne({ _id: volunteer.user });
    res.send({
      _id: volunteer._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      user: volunteer.user,
      isApproved: volunteer.isApproved,
      volunteerDays: volunteer.volunteerDays,
      volunteerTime: volunteer.volunteerTime,
      badgeCount: volunteer.badgeCount,
      token: generateToken(user),
    });
    return;
  } else {
    res.status(404).send({ message: 'Listener Not Found' });
  }
});

volunteerRouter.get('/user/:user', async (req, res) => {
  const volunteer = await Volunteer.findOne({ user: req.params.user });
  if (volunteer) {
    const user = await User.findOne({ _id: volunteer.user });
    res.send({
      _id: volunteer._id,
      user: volunteer.user,
      isApproved: volunteer.isApproved,
      volunteerDays: volunteer.volunteerDays,
      volunteerTime: volunteer.volunteerTime,
      badgeCount: volunteer.badgeCount,
      token: generateToken(user),
    });
    return;
  } else {
    res.status(404).send({ message: 'No volunteer found' });
  }
});

volunteerRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const volunteer = await Volunteer.findById(req.body.volunteerId);
    if (volunteer) {
      volunteer.volunteerTime =
        req.body.volunteerTime || volunteer.volunteerTime;
      volunteer.volunteerDays =
        req.body.volunteerDays || volunteer.volunteerDays;

      const updatedProfile = await volunteer.save();
      const user = await User.findOne({ _id: updatedProfile.user });
      res.send({
        _id: updatedProfile._id,
        volunteerDays: updatedProfile.volunteerDays,
        volunteerTime: updatedProfile.volunteerTime,
        isApproved: updatedProfile.isApproved,
        badgeCount: updatedProfile.badgeCount,
        user: updatedProfile.user,
        token: generateToken(user),
      });
    } else {
      res.status(404).send({ message: 'volunteer not found' });
    }
  })
);

volunteerRouter.put(
  '/approve',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const volunteer = await Volunteer.findById(req.body.id);
    if (volunteer) {
      volunteer.isApproved = req.body.value || volunteer.isApproved;

      const updatedProfile = await volunteer.save();
      const user = await User.findOne({ _id: updatedProfile.user });
      res.send({
        _id: updatedProfile._id,
        volunteerDays: updatedProfile.volunteerDays,
        volunteerTime: updatedProfile.volunteerTime,
        isApproved: updatedProfile.isApproved,
        badgeCount: updatedProfile.badgeCount,
        user: updatedProfile.user,
        token: generateToken(user),
      });
    } else {
      res.status(404).send({ message: 'volunteer not found' });
    }
  })
);

volunteerRouter.post(
  '/getById',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const volunteer = await Volunteer.findOne({ user: req.body.id });
    if (volunteer) {
      const user = await User.findOne({ _id: volunteer.user._id });
      res.send({
        _id: volunteer._id,
        name: volunteer.user.name,
        email: volunteer.user.email,
        isAdmin: volunteer.user.isAdmin,
        isApproved: volunteer.isApproved,
        volunteerDays: volunteer.volunteerDays,
        volunteerTime: volunteer.volunteerTime,
        badgeCount: volunteer.badgeCount,
        token: generateToken(volunteer.user),
      });
      return;
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

volunteerRouter.post(
  '/signup',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newVolunteer = new Volunteer({
      volunteerDays: req.body.volunteerDays,
      volunteerTime: req.body.volunteerTime,
      user: req.user._id,
    });
    const volunteer = await newVolunteer.save();
    const user = await User.findOne({ _id: volunteer.user });

    res.send({
      _id: volunteer._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      userId: volunteer.user,
      isApproved: volunteer.isApproved,
      volunteerDays: volunteer.volunteerDays,
      volunteerTime: volunteer.volunteerTime,
      badgeCount: volunteer.badgeCount,
      token: generateToken(user),
    });
  })
);

export default volunteerRouter;
