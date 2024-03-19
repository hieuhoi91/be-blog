import { BadRequestException, Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  async uploadFilesToCloudinary(
    files: Array<Express.Multer.File>,
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    return await this.uploadImage(files).catch((e) => {
      throw new BadRequestException(e.message);
    });
  }

  async uploadImage(files: Array<Express.Multer.File>) {
    return Promise.all(files.map((file) => this.uploadStream(file)));
  }

  uploadStream = async (file: Express.Multer.File) => {
    console.log(file);

    return new Promise<UploadApiResponse>((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });

      Readable.from(file.buffer).pipe(stream);
    });
  };
}
