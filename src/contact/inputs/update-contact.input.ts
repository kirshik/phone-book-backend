import { Field, InputType } from "@nestjs/graphql";
import { ID } from "@nestjs/graphql";

@InputType()
export class UpdateContactInput {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  nickname?: string;

  @Field(() => [String], { nullable: true })
  phoneNumbers?: string[];

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  photo?: string;

  @Field({ nullable: true, defaultValue: "original" })
  filter?: string;
}