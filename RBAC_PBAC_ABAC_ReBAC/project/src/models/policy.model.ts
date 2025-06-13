import mongoose, { Schema, model, models, Document } from 'mongoose';

export type AccessLevel = 'vip:all' | 'vip:team' | 'vip:self' | 'all' | 'team' | 'self';

export interface IPolicy extends Document {
  readonly _id: Schema.Types.ObjectId;
  id: number;
  name: string;
  description: string;
  permission: mongoose.Schema.Types.ObjectId;
  priorityAccessLevel: AccessLevel;
  appliesTo: 'Roles' | 'Global' | 'Team' | 'Department';
  targetTeam?: mongoose.Schema.Types.ObjectId;
  targetDepartment?: mongoose.Schema.Types.ObjectId;
  targetUsers?: Array<mongoose.Schema.Types.ObjectId>;
  targetRoles?: Array<mongoose.Schema.Types.ObjectId>;
  conditions: {
    minHierarchyLevel?: number;
    isTeamLead?: boolean;
    experienceLevel?: 'junior' | 'senior' | 'expert' | null;
    departmentId?: mongoose.Schema.Types.ObjectId;
    teamId?: mongoose.Schema.Types.ObjectId;
  };
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  reason: string;
}

const policySchema = new Schema<IPolicy>(
  {
    id: { type: Number, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    permission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'permission',
      required: true,
    },
    priorityAccessLevel: {
      type: String,
      enum: ['self', 'team', 'all', 'vip:all', 'vip:team', 'vip:self'],
      required: true,
    },
    targetTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'team',
      default: null,
    },
    targetDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'department',
      default: null,
    },
    appliesTo: {
      type: String,
      enum: ['Roles', 'Global', 'Team', 'Department'],
      required: true,
    },
    targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    targetRoles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'role' }],
    conditions: {
      minHierarchyLevel: { type: Number, default: null },
      isTeamLead: { type: Boolean, default: null },
      experienceLevel: {
        type: String,
        enum: ['junior', 'senior', 'expert', null],
        default: null,
      },
      // departmentId: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: 'department',
      //   default: null,
      // },
      // teamId: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: 'team',
      //   default: null,
      // },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    reason: { type: String, default: '' },
  },
  { timestamps: true }
);

policySchema.pre('save', async function (next) {
  if (this.isNew) {
    const PolicyModel = models.policy || model<IPolicy>('policy', policySchema);
    const lastId = await PolicyModel.findOne({}, {}, { sort: { id: -1 } }).exec();
    this.id = lastId ? lastId.id + 1 : 1;
  }
  next();
});

policySchema.index({ permission: 1 }, { background: true });
policySchema.index({ appliesTo: 1 }, { background: true });
policySchema.index({ appliesTo: 1, permission: 1 }, { background: true });

const Policy = models.policy || model<IPolicy>('policy', policySchema);

export default Policy;
