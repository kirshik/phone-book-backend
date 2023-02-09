import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContactEntity } from 'src/contact/entities/contact.entity';

import { CreateContactInput } from 'src/contact/inputs/create-contact.input';
import { UpdateContactInput } from 'src/contact/inputs/update-contact.input';

// import { StorageService } from 'src/storage/storage.service';


@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
    // implementation of Google Cloud Storage
    // private readonly storageService: StorageService,
  ) { }

  async createContact(createContactInput: CreateContactInput): Promise<ContactEntity> {
    return await this.contactRepository.save({ ...createContactInput });
  }
  // async createContact(createContactInput: CreateContactInput, image: Buffer): Promise<ContactEntity> {
  //   console.log("IMAGE: ", image);
  //   return await this.contactRepository.save({ ...createContactInput });
  // }
  // async createContact(createContactInput: CreateContactInput, image: Buffer): Promise<ContactEntity> {
  //   const bucketName = 'my-bucket';
  //   const fileName = `${createContactInput.firstName}-${createContactInput.lastName}.jpeg`;

  //   if (image) {
  //     const photo = await this.storageService.uploadImage(bucketName, fileName, image);

  //     const contact = await this.contactRepository.save({
  //       ...createContactInput,
  //       photo
  //     });
  //     return contact;
  //   }
  //   return await this.contactRepository.save({ ...createContactInput });

  // }
  async getContacts(): Promise<ContactEntity[]> {
    return await this.contactRepository.find({ order: { firstName: 'DESC' } });
  }

  async getOneContact(id: number): Promise<ContactEntity> {
    return await this.contactRepository.findOne({ where: { id } });
  }

  async removeContact(id: number): Promise<number> {
    await this.contactRepository.delete({ id });
    return id;
  }

  async updateContact(id: number, updateContactInput: UpdateContactInput): Promise<ContactEntity> {
    await this.contactRepository.update({ id: updateContactInput.id }, { ...updateContactInput });
    return await this.contactRepository.findOne({ where: { id } });
  }

  async searchContacts(searchQuery: string): Promise<ContactEntity[]> {
    // search by first name, last name, nickname, phone number trough all contacts
    // with capital letter in the beginning of the search query
    // and without capital letter in the beginning of the search query
    const capitalizeSearchQuery = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);
    const lowerCaseSearch = await this.contactRepository
      .createQueryBuilder("contact")
      .where("contact.firstName LIKE :searchQuery", { searchQuery: `%${searchQuery}%` })
      .orWhere("contact.lastName LIKE :searchQuery", { searchQuery: `%${searchQuery}%` })
      .orWhere("contact.nickname LIKE :searchQuery", { searchQuery: `%${searchQuery}%` })
      .orWhere("contact.phoneNumbers LIKE :searchQuery", { searchQuery: `%${searchQuery}%` })
      .getMany();
    const upperCaseSearch = await this.contactRepository
      .createQueryBuilder("contact")
      .where("contact.firstName LIKE :searchQuery", { searchQuery: `%${capitalizeSearchQuery}%` })
      .orWhere("contact.lastName LIKE :searchQuery", { searchQuery: `%${capitalizeSearchQuery}%` })
      .orWhere("contact.nickname LIKE :searchQuery", { searchQuery: `%${capitalizeSearchQuery}%` })
      .orWhere("contact.phoneNumbers LIKE :searchQuery", { searchQuery: `%${capitalizeSearchQuery}%` })
      .orderBy("contact.firstName", "DESC")
      .getMany();
    const searchResult = [...lowerCaseSearch, ...upperCaseSearch];
    return searchResult.filter((contact, index, self) =>
      index === self.findIndex((t) => (
        t.id === contact.id
      ))
    );
  }
}
