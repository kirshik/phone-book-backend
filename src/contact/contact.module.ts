import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContactEntity } from './entities/contact.entity';
import { ContactService } from './services/contact/contact.service';
import { ContactResolver } from './resolvers/contact/contact.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity])],
  providers: [ContactService, ContactResolver],
})
export class ContactModule { }
