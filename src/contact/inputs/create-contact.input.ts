import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateContactInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  nickname?: string;

  @Field(() => [String])
  phoneNumbers: string[];

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  photo?: string;

  @Field({ nullable: true, defaultValue: "original" })
  filter?: string;
}