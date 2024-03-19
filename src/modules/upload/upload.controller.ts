import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}
  @UseInterceptors(FilesInterceptor('files'))
  @Post('/')
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const uploadApiRes =
      await this.uploadService.uploadFilesToCloudinary(files);
    return { urls: uploadApiRes.map((res) => res.secure_url) };
  }
}
