import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//https://github.com/typeorm/typeorm/blob/master/docs/decorator-reference.md#column
@Entity("users") //table name
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Column("varchar", { length: 255 }) email: string;

  @Column("text") password: string;

  @Column("boolean", { default: false }) confirmed: boolean;
}
