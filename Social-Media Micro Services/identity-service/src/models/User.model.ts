import mongoose, { Schema, model, models, Document } from 'mongoose'
import validator from 'validator'
import argon2 from 'argon2'
import { UserRoles } from '../types/general'

// Define the IUser interface
export interface IUser extends Document {
  readonly _id: mongoose.Types.ObjectId
  username?: string
  email: string
  password?: string
  role?: UserRoles
  createdAt?: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

// Define the schema
const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: false,
    },
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
      required: false,
      trim: true,
      select: false,
      minlength: 8, // Fixed typo: `minLength` -> `minlength`
      maxlength: 128,
      validate: {
        validator: (value: string) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value),
        message: (props: { value: string }) =>
          `${props.value} is not a valid password. It should contain at least one uppercase letter, one lowercase letter, and one number.`,
      },
    },
    role: {
      type: String,
      required: true,
      default: 'USER',
      enum: ['ADMIN', 'USER', 'MODERATOR', 'VIP'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
)

// Pre-save hook to hash password
UserSchema.pre('save', async function (next): Promise<void> {
  if (this.isModified('password')) {
    try {
      if (this.password) {
        this.password = await argon2.hash(this.password)
      }
      next()
    } catch (error: any) {
      next(error)
    }
  } else {
    next()
  }
})

// Method to compare passwords
UserSchema.methods.comparePassword = async function (this: IUser, candidatePassword: string): Promise<boolean> {
  try {
    if (!this.password) {
      return false
    }
    return await argon2.verify(this.password, candidatePassword)
  } catch (error) {
    throw error
  }
}

// Create a text index for username
UserSchema.index({ username: 'text' })

// Define the model
const UserModel = models.user || model<IUser>('user', UserSchema)
export default UserModel
