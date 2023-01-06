import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table
export class Store extends Model<Store> {
  @Column
  storeNumber!: string;

  @Column
  storeType!: string;

  @Column
  status!: string;

  @Column
  information!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
