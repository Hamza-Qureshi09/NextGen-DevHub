import Joi from "joi";
import { ISearch } from "../models/Search.model";

const validatePost = (data: ISearch) => {
  const CheckRequiredId = Joi.string().hex().length(24).required();
  const schema = Joi.object({
    postId: CheckRequiredId,
    userId: CheckRequiredId,
    content: Joi.string().required(),
  });

  return schema.validate(data);
};

export { validatePost };
