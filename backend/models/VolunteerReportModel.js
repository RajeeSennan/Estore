import mongoose from 'mongoose';

const volunteerReportSchema = new mongoose.Schema(
  {
    selectedBook: { type: String },
    readingStatus: { type: String },
    completedOn: { type: Date },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer',
      required: true,
    },
    listener: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LIstener',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const VolunteerReport = mongoose.model(
  'VolunteerReport',
  volunteerReportSchema
);
export default VolunteerReport;
