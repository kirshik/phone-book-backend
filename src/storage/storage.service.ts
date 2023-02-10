import { Injectable, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileInterceptor } from '@nestjs/platform-express';

@Injectable()
export class StorageService {
  private readonly storage: Storage;

  constructor(private readonly storageClient: Storage) {
    this.storage = storageClient;
  }


  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() image: string, bucketName: string, fileName: string): Promise<string> {
    console.log(image);
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(fileName);

    await file.save(image, {
      resumable: false,
      metadata: {
        contentType: 'image/jpeg'
      }
    });

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-17-2025'
    });

    return url;
  }
}