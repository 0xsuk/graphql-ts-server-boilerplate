import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

//https://github.com/typeorm/typeorm/blob/master/docs/decorator-reference.md#column
@Entity("users") //table name
export class User extends BaseEntity {
  @PrimaryColumn("uuid") id: string;

  @Column("varchar", { length: 255 }) email: string;

  @Column("text") password: string;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
