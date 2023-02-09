import { Module } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { StorageService } from './storage.service';

@Module({
  providers: [
    {
      provide: Storage,
      useFactory: () => {
        return new Storage({
          projectId: 'phonebook-377223',
          keyFilename: '../../../phonebook-377223-47aa8eacda71.json'
        });
      }
    },
    StorageService
  ],
  exports: [Storage]
})
export class StorageModule { }