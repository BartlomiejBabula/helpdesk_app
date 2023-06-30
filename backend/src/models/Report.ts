import { Model, Column, Table } from "sequelize-typescript";

@Table
export class Report extends Model<Report> {
  @Column
  name!: string;
  @Column
  block!: boolean;
}
