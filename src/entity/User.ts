import * as bcrypt from "bcryptjs";
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

//https://github.com/typeorm/typeorm/blob/master/docs/decorator-reference.md#column
@Entity("users") //table name
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Column("varchar", { length: 255 }) email: string;

  @Column("text") password: string;

  @Column("boolean", { default: false }) confirmed: boolean;

  @BeforeInsert()
  @BeforeUpdate() //TODO: this is not called by User.update!. I have to `const user = User.findOne` & `user.password = newPassword` & `user.save`
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
