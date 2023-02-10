import { Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FilesInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';

@Resolver("Storage")
export class StorageResolver {
  constructor(
    private readonly storageService: StorageService,
  ) {

  }
  @Mutation(() => String)
  @UseInterceptors(FilesInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: string,
  ): Promise<string> {
    return await this.storageService.uploadImage(file, "my-bucket", "test.jpg");
  }

}


