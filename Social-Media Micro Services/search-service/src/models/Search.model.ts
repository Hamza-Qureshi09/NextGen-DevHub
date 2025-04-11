import mongoose, { Schema, model, models, Document } from "mongoose";

// Define the ISearch interface
export interface ISearch extends Document {
  readonly _id: mongoose.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const SearchSchema = new Schema<ISearch>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "post",
      required: true,
      //   type: String,
      //   required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      //   type: String,
      //   required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Creating index on content field
SearchSchema.index({ content: "text" }, { background: true });
SearchSchema.index({ createdAt: -1 }, { background: true });

// Define the model
const SearchModel = models.post || model<ISearch>("search", SearchSchema);
export default SearchModel;
