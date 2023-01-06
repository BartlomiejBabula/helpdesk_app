import {
  Model,
  Column,
  CreatedAt,
  UpdatedAt,
  Table,
} from "sequelize-typescript";

@Table
export class User extends Model<User> {
  @Column
  email!: string;

  @Column
  password!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
