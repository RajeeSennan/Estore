import mongoose from 'mongoose';

const volunteerUserSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  voulteerId: { type: String, required: true },  
  isApproved: { type: Boolean, default: false, required: true },
  volunteerDays: { type: String, required: true },
  volunteerTime: { type: String, required: true },
  badgeCount: { type: Number },
});

const VolunteerUser = mongoose.model('VolunteerUser', volunteerUserSchema);
export default VolunteerUser;
