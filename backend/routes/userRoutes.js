import { isAuth, generateToken, isAdmin } from '../utils.js';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/UserModel.js';
import Volunteer from '../models/VolunteerModel.js';


const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  const user = await User.find();
  res.send(user);
});

userRouter.get('/onlyUsers', async (req, res) => {
  const users = await User.find({ isAdmin: false });

  const volunteerUsers = [];
  if (users.length > 0) {
    for (var user in users) {
      const volunteer = await Volunteer.findOne({ user: users[user].id });
      if (volunteer) {
        console.log(users[user].name);
        const vu = new Object();
        vu.userId = users[user].id;
        vu.name = users[user].name;
        vu.email = users[user].email;       
        vu.isApproved = users[user].isApproved;
        vu.volunteerDays = volunteer.volunteerDays;
        vu.volunteerTime = volunteer.volunteerTime;
        vu.badgeCount = volunteer.badgeCount;
        vu.volunteerId = volunteer._id;
        volunteerUsers.push(vu);
      } else {
        console.log(users[user].name);
        const vu = new Object();
        vu.userId = users[user].id;
        vu.name = users[user].name;
        vu.email = users[user].email;
        vu.volunteerId = 'NULL';
        volunteerUsers.push(vu);
      }
    }
  }
  res.send(volunteerUsers);
});

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    console.log(req.body.email);
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log('user exist');
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    console.log(user.email);
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

export default userRouter;
