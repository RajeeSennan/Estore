import mongoose from 'mongoose';

const listenerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: {type: Number, required: true},
    grade: {type:Number, required: true },
    school: {type:String, required: true},
    email: { type: String, required: true, unique: true },  
    isActive: {type: Boolean, required: true, default: false},
    isVerified: {type: Boolean, required: true, default: false},
    listeningDays: {type: String, required: true},
    listeningTime: {type: String, required: true},
    completedCount: {type:Number},
    volunteer :{type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer'}
  },
  {
    timestamps: true,
  }
);

const Listener = mongoose.model('Listener', listenerSchema);
export default Listener;
