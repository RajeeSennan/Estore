import { generateToken } from '../utils.js';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/UserModel.js';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  const user = await User.find();
  res.send(user);
});

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    console.log(req.body.email);
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log('user exist');
      if (bcrypt.compareSync( req.body.password, user.password)) {
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

export default userRouter;
