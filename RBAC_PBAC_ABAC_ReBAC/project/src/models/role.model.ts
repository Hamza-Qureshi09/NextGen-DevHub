import mongoose, { Schema, model, models, Document } from 'mongoose';
import { AccessLevel } from './policy.model';

export interface IRoles extends Document {
  readonly _id: Schema.Types.ObjectId;
  id: number;
  name: string;
  description: string;
  permissions?: Array<{
    permission: mongoose.Schema.Types.ObjectId;
    accessLevel: AccessLevel;
  }>;
  parentRoles?: Array<mongoose.Schema.Types.ObjectId>;
  createdBy?: mongoose.Schema.Types.ObjectId;
  isActive: boolean;
}

const roleSchema = new Schema<IRoles>(
  {
    id: { type: Number, unique: true },
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ['Admin', 'User', 'Manager', 'Marketer', 'Ceo'],
    },
    description: { type: String, required: true },
    permissions: [
      {
        permission: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'permission',
          required: true,
        },
        accessLevel: {
          type: String,
          enum: ['self', 'team', 'all', 'vip:all', 'vip:team', 'vip:self'],
          required: true,
        },
      },
    ],
    parentRoles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'role' }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

roleSchema.pre('save', async function (next) {
  if (this.isNew) {
    const RoleModel = models.role || model<IRoles>('role', roleSchema);
    const lastId = await RoleModel.findOne({}, {}, { sort: { id: -1 } }).exec();
    this.id = lastId ? lastId.id + 1 : 1;
  }
  next();
});

roleSchema.index({ isActive: 1 });

const Role = models.role || model<IRoles>('role', roleSchema);

export default Role;
