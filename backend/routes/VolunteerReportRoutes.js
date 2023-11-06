import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import VolunteerReport from '../models/VolunteerReportModel.js';

const volunteerReportRouter = express.Router();

volunteerReportRouter.get('/', async (req, res) => {
  const volunteerReport = await VolunteerReport.find();
  res.send(volunteerReport);
});

volunteerReportRouter.get('/:id', async (req, res) => {
  const volunteerReport = await VolunteerReport.findOne({
    volunteer: req.params.id,
  });
  if (volunteerReport) {
    res.send(volunteerReport);
  } else {
    res.send();
  }
});

volunteerReportRouter.put(
  '/update',
  expressAsyncHandler(async (req, res) => {
    const volunteerReport = await VolunteerReport.findOne({
      volunteer: req.body.volunteerId,
      listener: req.body.listenerId,
    });
    if (volunteerReport) {
      volunteerReport.selectedBook =
        req.body.selectedBook || volunteerReport.selectedBook;
      volunteerReport.readingStatus =
        req.body.readingStatus || volunteerReport.readingStatus;
      volunteerReport.completedOn =
        req.body.completedOn || volunteerReport.completedOn;

      const updatedReport = await VolunteerReport.save();

      res.send({ message: 'Updated' });
    } else {
      const newVolunteerReport = new VolunteerReport({
        selectedBook: req.body.selectedBook,
        readingStatus: req.body.readingStatus,
        volunteer: req.body.volunteerId,
        listener: req.body.listenerId,
      });
      const volunteerReport = await newVolunteerReport.save();
      res.send(volunteerReport);
    }
  })
);

export default volunteerReportRouter;
