import argon2 from 'argon2'
import mongoose, { Schema } from 'mongoose'

// Method to compare passwords
export const comparePassword = async (encryptedPassword: any, candidatePassword: string): Promise<boolean> => {
  try {
    if (!encryptedPassword) {
      return false
    }
    return await argon2.verify(encryptedPassword, candidatePassword)
  } catch (error) {
    throw error
  }
}

export const stringIdToObjectId = (id: string): Schema.Types.ObjectId => {
  return new mongoose.Types.ObjectId(id) as unknown as Schema.Types.ObjectId // ✅ Works, but not ideal
}
