import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: { type: Number, default: 0, required: true },
    volunteerDays: { type: String, required: true },
    volunteerTime: { type: String, required: true },
    BadgeCount: { type: Number },
    
  },
  {
    timestamps: true,
  }
);

const Volunteer = mongoose.model('Volunteer', volunteerSchema);
export default Volunteer;
