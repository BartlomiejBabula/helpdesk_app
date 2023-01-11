import { createServer } from "http";
import { app } from "./app";
import { sequelize } from "./sequelize";
import xlsx from "node-xlsx";

const port = process.env.NODE_DOCKER_PORT;

const workSheetsFromFile = xlsx.parse(`${__dirname}/config/lista-sklepow.xlsx`);

(async () => {
  await sequelize.sync({ force: true });
  createServer(app).listen(port, () =>
    console.info(`Server running on port ${port}`)
  );

  //DEV FAKE DATA
  const admin = {
    email: "admin@admin.com",
    password: "fadada",
  };
  await sequelize.models.User.bulkCreate([admin]);

  let stores: any = [];
  workSheetsFromFile[0].data.map((store: any, id) => {
    if (id !== 0) {
      stores.push({
        storeNumber: store[0],
        storeType: store[2],
        status: store[3],
        information: store[1] ? store[1] : "",
      });
    }
  });
  await sequelize.models.Store.bulkCreate(stores);
})();
