import mongoose, { Schema } from "mongoose";

interface ICourse {
  absent_hours: number;
  subject_name: string;
  conducted_hours?: number;
}

interface IUpdate extends Document {
  token: string;
  chatid: mongoose.Types.ObjectId;
  courses: ICourse[];
  from: string;
}

const updateSchema = new Schema<IUpdate>({
  token: {
    type: String,
    required: true,
  },
  chatid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
    unique: true,
  },
  courses: [
    {
      absent_hours: {
        type: Number,
        required: true,
      },
      subject_name: {
        type: String,
        required: true,
      },
      conducted_hours: {
        type: Number,
      },
    },
  ],
  from: {
    type: String,
    required: true,
  },
});

const Update = mongoose.model<IUpdate>("Update", updateSchema);
export default Update;
