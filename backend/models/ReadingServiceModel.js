import mongoose from 'mongoose'
const readingService = new mongoose.Schema(
    {
        listener: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listener',
            required: true,
          },
          volunteer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Volunteer',
            required: true,
          },
          bookName: {type:String, required: true},
          isCompleted: {type: Boolean, required: true, default:false},
          completedOn: {type:Date}

    }
)