// import { Schema, model, models, Document } from 'mongoose';
// import validator from 'validator';
// import bcrypt from 'bcrypt';

// // Define the IUser interface
// export interface IUser extends Document {
//   readonly _id: Schema.Types.ObjectId;
//   username?: string;
//   email: string;
//   password?: string;
//   createdAt?: Date;
//   comparePassword(candidatePassword: string): Promise<boolean>;
// }

// const staffUserSchema = new Schema<IUser>(
//   {
//     id: { type: Number, unique: true },
//     name: { type: String, required: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//       trim: true,
//       validate: {
//         validator: (val: string) => validator.isEmail(val),
//         message: (props: { value: string }) => `${props.value} is not a valid email address.`,
//       },
//     },
//     password: {
//       type: String,
//       required: true,
//       trim: true,
//       select: false,
//       minLength: 8,
//       maxlength: 128,
//       validate: {
//         validator: (value: string) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value),
//         message: (props: { value: string }) =>
//           `${props.value} is not a valid password. It should contain at least one uppercase letter, one lowercase letter, and one number.`,
//       },
//     },
//     passwordResetToken: { type: String, select: false },
//     passwordResetExpires: { type: Date, select: false },
//     changePassword: {
//       type: String,
//       required: false,
//       trim: true,
//       select: false,
//       minLength: 8,
//       maxlength: 128,
//     },
//     phoneNo: { type: String, unique: true, required: true, index: true },
//     cnic_no: { type: String, required: true },
//     gender: {
//       type: String,
//       required: true,
//       enum: ['male', 'female', 'others', 'Male', 'Female', 'not_set'],
//       default: 'not_set',
//     },
//     dateOfBirth: { type: String, required: false },
//     address: { type: String, required: true },
//     country: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'countries',
//       required: true,
//     },
//     city: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'cities',
//       required: true,
//     },
//     region: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'region',
//       required: false,
//     },
//     cnic_attachment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'attachment',
//       required: false,
//     },
//     signature_attachment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'attachment',
//       required: false,
//     },
//     staff_user_avatar_attachment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'attachment',
//       required: false,
//     },
//     status: {
//       type: String,
//       required: true,
//       enum: ['active', 'suspended', 'blocked'],
//       default: 'active',
//     },
//     blockReasonAndDetails: {
//       details: { type: String, required: false },
//       blockedReason: { type: String, required: false },
//     },
//     designation: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'designation',
//       required: false,
//     },
//     staffRoaster: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'staffroaster',
//       required: false,
//     },
//     patchUser: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'staffuser',
//       required: false,
//     },
//     patchUsersList: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'staffuser',
//         required: false,
//       },
//     ],
//     departments: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'department',
//         required: false,
//       },
//     ],
//     teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'team', required: false }],
//     roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'role', required: false }],
//     sharedLeads: {
//       sales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'lead', required: false }],
//       supports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'lead', required: false }],
//     },

//     addedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'staffuser',
//       required: false,
//     },
//     directPermissions: [
//       {
//         permission: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'permission',
//           required: true,
//         },
//         accessLevel: {
//           type: String,
//           enum: ['self', 'team', 'all', 'specific'],
//           required: true,
//         },
//       },
//     ],
//     vip_permissions_list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'policy' }],
//     attributes: {
//       isTeamLead: { type: Boolean, default: false }, //manager
//       isDepartmentHead: { type: Boolean, default: false }, //dprthead
//       experienceLevel: {
//         type: String,
//         enum: ['junior', 'mid', 'senior', 'expert'],
//         default: 'junior',
//       },
//       customAttributes: { type: Map, of: String },
//     },
//   },
//   { timestamps: true }
// );

// // Password hashing
// staffUserSchema.pre('save', async function (next): Promise<void> {
//   if (this.isModified('password')) {
//     try {
//       if (this.password) {
//         this.password = await bcrypt.hash(this.password, 12);
//       }
//       if (this.isNew) {
//         const lastUserId = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
//         this.id = lastUserId ? lastUserId.id + 1 : 1;
//       }
//       next();
//     } catch (error: any) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

// // Password comparison method
// staffUserSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string): Promise<boolean> {
//   try {
//     if (!this.password) {
//       return false;
//     }
//     return await bcrypt.compare(candidatePassword, userPassword);
//   } catch (error) {
//     throw error;
//   }
// };

// // Indexes
// staffUserSchema.index({ name: 'text', email: 'text' }, { background: true });
// staffUserSchema.index({ status: 1, addedBy: 1 }, { background: true });
// staffUserSchema.index({ departments: 1, designation: 1 }, { background: true });
// staffUserSchema.index({ teams: 1 }, { background: true });
// staffUserSchema.index({ roles: 1 }, { background: true });
// staffUserSchema.index({ vip_permissions_list: 1 }, { background: true });

// const StaffUser = models.user || model<IUser>('staffuser', staffUserSchema, 'staffusers');

// export default StaffUser;
