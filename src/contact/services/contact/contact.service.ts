import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContactEntity } from 'src/contact/entities/contact.entity';

import { CreateContactInput } from 'src/contact/inputs/create-contact.input';
import { UpdateContactInput } from 'src/contact/inputs/update-contact.input';



@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
  ) { }


  async createContact(createContactInput: CreateContactInput): Promise<ContactEntity> {
    return await this.contactRepository.save({ ...createContactInput });
  }

  async getContacts(offset: number, chunkSize: number): Promise<ContactEntity[]> {
    return await this.contactRepository.find({
      order: { firstName: 'DESC' },
      skip: offset,
      take: chunkSize
    });
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

  async searchContacts(searchQuery: string, offset: number, chunkSize: number): Promise<ContactEntity[]> {
    const capitalizeSearchQuery = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);

    const queryBuilder = this.contactRepository
      .createQueryBuilder("contact")
      .where("contact.firstName LIKE :searchQuery", { searchQuery: `%${searchQuery}%` })
      .orWhere("contact.lastName LIKE :searchQuery", { searchQuery: `%${searchQuery}%` })
      .orWhere("contact.nickname LIKE :searchQuery", { searchQuery: `%${searchQuery}%` })
      .orWhere("contact.phoneNumbers LIKE :searchQuery", { searchQuery: `%${searchQuery}%` });

    const lowerCaseSearch = await queryBuilder
      .orderBy("contact.firstName", "DESC")
      .offset(offset)
      .limit(chunkSize)
      .getMany();

    queryBuilder
      .where("contact.firstName LIKE :searchQuery", { searchQuery: `%${capitalizeSearchQuery}%` })
      .orWhere("contact.lastName LIKE :searchQuery", { searchQuery: `%${capitalizeSearchQuery}%` })
      .orWhere("contact.nickname LIKE :searchQuery", { searchQuery: `%${capitalizeSearchQuery}%` })
      .orWhere("contact.phoneNumbers LIKE :searchQuery", { searchQuery: `%${capitalizeSearchQuery}%` });

    const upperCaseSearch = await queryBuilder
      .orderBy("contact.firstName", "DESC")
      .offset(offset)
      .limit(chunkSize)
      .getMany();

    const searchResult = [...lowerCaseSearch, ...upperCaseSearch];
    return searchResult.filter((contact, index, self) =>
      index === self.findIndex((t) => (
        t.id === contact.id
      ))
    );
  }
}
