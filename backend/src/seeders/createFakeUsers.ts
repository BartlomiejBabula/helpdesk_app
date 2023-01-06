import { faker } from "@faker-js/faker";
import { sequelize } from "../sequelize";

const users = [...Array(20)].map((user) => ({
  email: faker.internet.email(),
  password: faker.internet.password(6),
  createdAt: new Date(),
  updatedAt: new Date(),
}));

sequelize.models.User.bulkCreate(users);
