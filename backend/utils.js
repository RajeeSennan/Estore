import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  // return jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
  // expiresIn: '30d',
  //});

  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};
