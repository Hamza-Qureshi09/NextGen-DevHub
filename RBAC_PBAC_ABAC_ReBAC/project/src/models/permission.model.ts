import mongoose, { Schema, model, models, Document } from 'mongoose';
import { AccessLevel } from './policy.model'; // Assuming AccessLevel is defined in policy.model

export interface IPermission extends Document {
  readonly _id: Schema.Types.ObjectId;
  id: number;
  name: string;
  description: string;
  module: string;
  action: string;
  accessLevels: AccessLevel[];
  createdBy?: mongoose.Schema.Types.ObjectId;
}

const validAccessLevels: AccessLevel[] = ['self', 'team', 'all', 'vip:self', 'vip:team', 'vip:all'];

const permissionSchema = new Schema<IPermission>(
  {
    id: { type: Number, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    module: { type: String, required: true },
    action: { type: String, required: true },
    accessLevels: {
      type: [{ type: String, enum: validAccessLevels }],
      required: true,
      validate: {
        validator: (arr: AccessLevel[]) => arr.length > 0,
        message: 'At least one access level is required',
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: false,
    },
  },
  { timestamps: true }
);

permissionSchema.pre('save', async function (next) {
  if (this.isNew) {
    const PermissionModel = models.permission || model<IPermission>('permission', permissionSchema);
    const lastId = await PermissionModel.findOne({}, {}, { sort: { id: -1 } }).exec();
    this.id = lastId ? lastId.id + 1 : 1;
  }
  next();
});

permissionSchema.index({ module: 1, action: 1 }, { unique: true });

const Permission = models.permission || model<IPermission>('permission', permissionSchema);

export default Permission;
