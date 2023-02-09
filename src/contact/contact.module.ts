import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContactEntity } from './entities/contact.entity';
import { ContactService } from './services/contact/contact.service';
import { ContactResolver } from './resolvers/contact/contact.resolver';
// import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity])],
  providers: [ContactService, ContactResolver],
  // providers: [ContactService, ContactResolver, StorageService],
})
export class ContactModule { }
