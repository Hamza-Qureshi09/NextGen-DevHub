import mongoose, { Schema, model, models, Document } from "mongoose";

// Define the IMedia interface
export interface IMedia extends Document {
  readonly _id: mongoose.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  publicId: string;
  mimeType: string;
  url: string;
  secure_url: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const MediaSchema = new Schema<IMedia>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Define the model
const MediaModel = models.Media || model<IMedia>("Media", MediaSchema);
export default MediaModel;
