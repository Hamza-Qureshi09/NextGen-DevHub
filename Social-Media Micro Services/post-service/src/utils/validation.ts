import Joi from "joi";
import { IPost } from "../models/Post.model";

const validatePost = (data: IPost) => {
  const CheckRequiredId = Joi.string().hex().length(24).required();
  const schema = Joi.object({
    user: CheckRequiredId,
    content: Joi.string().allow("").optional(),
    mediaIds: Joi.array().items(Joi.string()).optional(),
  });

  return schema.validate(data);
};

export { validatePost };
