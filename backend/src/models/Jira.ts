import { Model, Column, Table } from "sequelize-typescript";

@Table
export class Jira extends Model<Jira> {
  @Column
  jiraKey!: string;
  @Column
  auto!: boolean;
}
