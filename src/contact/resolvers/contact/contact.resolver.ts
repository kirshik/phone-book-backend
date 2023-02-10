import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContactEntity } from 'src/contact/entities/contact.entity';
import { CreateContactInput } from 'src/contact/inputs/create-contact.input';
import { UpdateContactInput } from 'src/contact/inputs/update-contact.input';
import { ContactService } from 'src/contact/services/contact/contact.service';

@Resolver("Contact")
export class ContactResolver {
  constructor(
    private readonly contactService: ContactService,
  ) {

  }
  @Mutation(() => ContactEntity)
  async createContact(
    @Args('createContact') createContactInput: CreateContactInput
  ): Promise<ContactEntity> {
    return await this.contactService.createContact(createContactInput);
  }

  @Mutation(() => ContactEntity)
  async updateContact(@Args('updateContact') updateContactInput: UpdateContactInput): Promise<ContactEntity> {
    return await this.contactService.updateContact(updateContactInput.id, updateContactInput);
  }

  @Mutation(() => Number)
  async removeContact(@Args('id') id: number): Promise<number> {
    return await this.contactService.removeContact(id);
  }


  @Query(() => ContactEntity)
  async getOneContact(@Args('id') id: number): Promise<ContactEntity> {
    return await this.contactService.getOneContact(id);
  }

  @Query(() => [ContactEntity])
  async getContacts(
    @Args({ name: 'offset', type: () => Int, defaultValue: 0 }) offset: number,
    @Args({ name: 'chunkSize', type: () => Int, defaultValue: 5 }) chunkSize: number,
  ): Promise<ContactEntity[]> {
    return await this.contactService.getContacts(offset, chunkSize);
  }

  @Query(() => [ContactEntity])
  async searchContacts(
    @Args('searchQuery') searchQuery: string,
    @Args({ name: 'offset', type: () => Int, defaultValue: 0 }) offset: number,
    @Args({ name: 'chunkSize', type: () => Int, defaultValue: 5 }) chunkSize: number,
  ): Promise<ContactEntity[]> {
    return await this.contactService.searchContacts(searchQuery, offset, chunkSize);
  }
}


