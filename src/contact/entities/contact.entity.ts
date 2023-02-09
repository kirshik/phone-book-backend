import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
@Entity('contact')
export class ContactEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nickname: string;

  @Field(() => [String])
  @Column('simple-array')
  phoneNumbers: string[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  address: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  photo: string;

  @Field({ nullable: true, defaultValue: "original" })
  @Column({ nullable: true, default: "original" })
  filter: string;

}