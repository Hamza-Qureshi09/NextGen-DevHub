import mongoose, { Schema, model, models, Document } from 'mongoose';
import { AccessLevel } from './policy.model';

// Define the IDepartment interface
export interface IDepartment extends Document {
  readonly _id: Schema.Types.ObjectId;
  id: number;
  name: string;
  description?: string;
  departmentHead?: mongoose.Schema.Types.ObjectId;
  type: string;
  teams?: Array<mongoose.Schema.Types.ObjectId>;
  staff?: Array<mongoose.Schema.Types.ObjectId>;
  status: 'active' | 'inactive';
  department_permissions?: Array<{
    permission: mongoose.Schema.Types.ObjectId;
    accessLevel: AccessLevel;
  }>;
  addedBy?: mongoose.Schema.Types.ObjectId;
}

const departmentSchema = new Schema<IDepartment>(
  {
    id: { type: Number, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    departmentHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: false,
    },
    type: {
      type: String,
      required: true,
      enum: ['sales', 'support', 'marketing', 'technical', 'finance', 'administrative', 'management', 'other'],
    },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'team', required: false }],
    staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false }],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    department_permissions: [
      {
        permission: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'permission',
          required: true,
        },
        accessLevel: {
          type: String,
          enum: ['self', 'team', 'all', 'vip:all', 'vip:team', 'vip:self'],
          default: 'all',
          required: true,
        },
      },
    ],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: false,
    },
  },
  { timestamps: true }
);

// Auto-increment ID
departmentSchema.pre('save', async function (next) {
  if (this.isNew) {
    const DepartmentModel = models.department || model<IDepartment>('department', departmentSchema);
    const lastId = await DepartmentModel.findOne({}, {}, { sort: { id: -1 } }).exec();
    this.id = lastId ? lastId.id + 1 : 1;
  }
  next();
});

departmentSchema.index({ type: 1 });
departmentSchema.index({ departmentHead: 1 });
departmentSchema.index({ status: 1 });
departmentSchema.index({ 'department_permissions.permission': 1 });

const Department = models.department || model<IDepartment>('department', departmentSchema);

export default Department;
