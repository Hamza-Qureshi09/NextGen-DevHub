import cloudinary, {
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import { EnvConfig } from "../conf/env_config";
import logger from "./logger";

const cloudinaryV2 = cloudinary.v2;

// General Details
cloudinaryV2.config({
  cloud_name: EnvConfig.CLOUDINARY_CLOUD_NAME,
  api_key: EnvConfig.CLOUDINARY_API_KEY,
  api_secret: EnvConfig.CLOUDINARY_API_SECRET,
});

export const uploadMediaToCloudinary = (
  file: any | Express.Multer.File,
  from: "RAM_Memory" | "ROM_Memory"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    if (from === "RAM_Memory") {
      const uploadStream = cloudinaryV2.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "micro_services",
          unique_filename: false,
          use_filename: true,
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error) {
            logger.error("Error uploading to cloudinary: ", error);
            reject(error);
          }

          if (result) return resolve(result as UploadApiResponse);
          logger.error("Error uploading to cloudinary ");
          reject(new Error("Unknown error occurred during upload"));
        }
      );

      uploadStream.end(file.buffer);
    } else if (from === "ROM_Memory") {
      cloudinaryV2.uploader.upload(
        file?.path || "",
        {
          resource_type: "auto",
          folder: "micro_services",
          unique_filename: false,
          use_filename: true,
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error) {
            logger.error("Error uploading to cloudinary: ", error);
            reject(error);
          }
          if (result) return resolve(result as UploadApiResponse);
          logger.error("Error uploading to cloudinary ");
          reject(new Error("Unknown error occurred during upload"));
        }
      );
    }
  });
};

// delete media from cloudinary
export const deleteMediaFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinaryV2.uploader.destroy(publicId);
    logger.info(" ✅ Media deleted successfully from cloudinary", publicId);
    return result;
  } catch (error) {
    logger.error("Error deleting media from cloudinary", error);
    throw error;
  }
};
