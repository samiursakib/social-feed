import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinaryV2,
  UploadApiResponse,
  DeleteApiResponse,
} from 'cloudinary';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinaryV2.uploader.upload_stream((err, res) => {
        if (err) return reject(new Error(String(err.message)));
        if (!res) return reject(new Error('Cloudinary upload failed'));
        resolve(res);
      });
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  removeFile(publicId: string): Promise<DeleteApiResponse> {
    return cloudinaryV2.uploader.destroy(publicId, { invalidate: true });
  }
}
