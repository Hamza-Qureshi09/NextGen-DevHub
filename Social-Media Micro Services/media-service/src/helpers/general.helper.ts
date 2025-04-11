import fs from 'node:fs'
import mongoose from 'mongoose'
import { UPLOADS_FOLDER } from '../constants/general.constants'

// Ensure the uploads folder exists
export const ensureFolderExists = () => {
  if (!fs.existsSync(UPLOADS_FOLDER)) {
    fs.mkdirSync(UPLOADS_FOLDER, { recursive: true })
  }
}

export const stringIdToObjectId = (id: string) => {
  return new mongoose.Types.ObjectId(id)
}
