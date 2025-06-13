import mongoose, { Schema, model, models, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { AccessLevel } from './policy.model';

export interface IUser extends Document {
  readonly _id: Schema.Types.ObjectId;
  id: number;
  username: string;
  email: string;
  password: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  changePassword?: string;
  status: 'active' | 'suspended' | 'blocked';
  isSuperAdmin?: boolean;
  departments?: Array<mongoose.Schema.Types.ObjectId>;
  teams?: Array<mongoose.Schema.Types.ObjectId>;
  roles?: Array<mongoose.Schema.Types.ObjectId>;
  addedBy?: mongoose.Schema.Types.ObjectId;
  directPermissions?: Array<{
    permission: mongoose.Schema.Types.ObjectId;
    accessLevel: AccessLevel;
  }>;
  vip_permissions_list?: Array<mongoose.Schema.Types.ObjectId>;
  attributes?: {
    isTeamLead: boolean;
    isDepartmentHead: boolean;
    experienceLevel: 'junior' | 'mid' | 'senior' | 'expert';
    customAttributes: Map<string, string>;
  };
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: Number, unique: true },
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (val: string) => validator.isEmail(val),
        message: (props: { value: string }) => `${props.value} is not a valid email address.`,
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
      minlength: 8,
      maxlength: 128,
      validate: {
        validator: (value: string) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value),
        message: (props: { value: string }) =>
          `${props.value} is not a valid password. It should contain at least one uppercase letter, one lowercase letter, and one number.`,
      },
    },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    changePassword: {
      type: String,
      required: false,
      trim: true,
      select: false,
      minlength: 8,
      maxlength: 128,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'suspended', 'blocked'],
      default: 'active',
    },
    isSuperAdmin: { type: Boolean, default: false },
    departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'department', required: false }],
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'team', required: false }],
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'role', required: false }],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: false,
    },
    directPermissions: [
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
    vip_permissions_list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'policy' }],
    attributes: {
      isTeamLead: { type: Boolean, default: false },
      isDepartmentHead: { type: Boolean, default: false },
      experienceLevel: {
        type: String,
        enum: ['junior', 'mid', 'senior', 'expert'],
        default: 'junior',
      },
      customAttributes: { type: Map, of: String },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    const UserModel = models.user || model<IUser>('user', UserSchema);
    const lastId = await UserModel.findOne({}, {}, { sort: { id: -1 } }).exec();
    this.id = lastId ? lastId.id + 1 : 1;
  }
  if (this.isModified('password')) {
    try {
      if (this.password) {
        this.password = await bcrypt.hash(this.password, 12);
      }
      next();
    } catch (error: any) {
      next(error);
    }
  } else {
    next();
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    if (!this.password) {
      return false;
    }
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Create a text index for username
UserSchema.index({ username: 'text' });

const UserModel = models.user || model<IUser>('user', UserSchema);

export default UserModel;
