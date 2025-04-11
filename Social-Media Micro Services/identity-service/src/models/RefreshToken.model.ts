import { Schema, model, models, Document } from 'mongoose'
// import { IUser } from './User.model'

interface RefreshToken extends Document {
  token: string
  user: Schema.Types.ObjectId
  expiresAt: Date
}

const refreshTokenSchema = new Schema<RefreshToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
)

//  creating TTL
// refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const RefreshToken = models.refreshToken || model<RefreshToken>('refreshToken', refreshTokenSchema)
export default RefreshToken
