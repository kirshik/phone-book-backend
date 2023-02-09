import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class StorageService {
  private readonly storage: Storage;

  constructor(private readonly storageClient: Storage) {
    this.storage = storageClient;
  }

  async uploadImage(bucketName: string, fileName: string, image: Buffer): Promise<string> {
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