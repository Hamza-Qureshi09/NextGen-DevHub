import mongoose, { Schema, model, models, Document } from 'mongoose';
import { AccessLevel } from './policy.model';

export interface ITeam extends Document {
  readonly _id: Schema.Types.ObjectId;
  id: number;
  team_name: string;
  description?: string;
  hierarchyLevel: number;
  departments?: Array<mongoose.Schema.Types.ObjectId>;
  manager?: mongoose.Schema.Types.ObjectId;
  team_members?: Array<{
    staff_user: mongoose.Schema.Types.ObjectId;
    is_admin: boolean;
    joinDate: Date;
  }>;
  addedBy?: mongoose.Schema.Types.ObjectId;
  parent_team?: mongoose.Schema.Types.ObjectId;
  child_teams?: Array<mongoose.Schema.Types.ObjectId>;
  team_permissions: Array<{
    permission: mongoose.Schema.Types.ObjectId;
    accessLevel: AccessLevel;
  }>;
  team_status: 'active' | 'inactive';
}

const teamSchema = new Schema<ITeam>(
  {
    id: { type: Number, unique: true },
    team_name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    hierarchyLevel: {
      type: Number,
      required: true,
      default: 0,
    },
    departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'department', required: false }],
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: false,
    },
    team_members: [
      {
        staff_user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
          required: true,
        },
        is_admin: {
          type: Boolean,
          required: true,
        },
        joinDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: false,
    },
    parent_team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'team',
      required: false,
    },
    child_teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'team', required: false }],
    team_permissions: [
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
          default: 'team',
        },
      },
    ],
    team_status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true,
    },
  },
  { timestamps: true }
);

teamSchema.pre('save', async function (next) {
  const TeamModel = models.team || model<ITeam>('team', teamSchema);
  if (this.isNew) {
    const lastId = await TeamModel.findOne({}, {}, { sort: { id: -1 } }).exec();
    this.id = lastId ? lastId.id + 1 : 1;
  }
  if (this.parent_team) {
    const parentTeam = await TeamModel.findById(this.parent_team);
    if (parentTeam) {
      this.hierarchyLevel = parentTeam.hierarchyLevel + 1;
    }
  }
  next();
});

teamSchema.index({ parent_team: 1 });
teamSchema.index({ departments: 1 });
teamSchema.index({ hierarchyLevel: 1 });
teamSchema.index({ 'team_members.staff_user': 1 });
teamSchema.index({ 'team_permissions.permission': 1 });

const Team = models.team || model<ITeam>('team', teamSchema);

export default Team;
