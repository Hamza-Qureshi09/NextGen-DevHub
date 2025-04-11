import mongoose, { Schema, model, models, Document } from "mongoose";

// Define the IPost interface
export interface IPost extends Document {
  readonly _id: mongoose.Types.ObjectId;
  user: Schema.Types.ObjectId;
  content?: string;
  mediaIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const PostSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mediaIds: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true }
);

// Creating index on content field
PostSchema.index({ content: "text" }, { background: true });

// Define the model
const PostModel = models.post || model<IPost>("post", PostSchema);
export default PostModel;
