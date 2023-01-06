import { Router, Request, Response } from "express";
import { Store } from "../models/Store";

export const stores = Router();

stores.post("/", async (req: Request, res: Response, next) => {
  try {
    const newStore = req.body;
    let newStoreExist: boolean = false;
    if (newStore.storeNumber && newStore.storeType && newStore.status) {
      const storeNumberList = await Store.findAll({
        attributes: ["storeNumber"],
      });
      storeNumberList.filter(
        (store) =>
          store.dataValues.storeNumber === newStore.storeNumber &&
          (newStoreExist = true)
      );
      if (newStoreExist) {
        res
          .status(400)
          .json(`Store exists with this number: ${newStore.storeNumber}`);
      } else {
        const user = await Store.create(req.body);
        res.status(201).json(newStore);
      }
    } else {
      res
        .status(400)
        .json("Store need to requaried storeNumber, storeType and status");
    }
  } catch (e) {
    next(e);
  }
});

stores.get("/", async (req: Request, res: Response, next) => {
  try {
    res.json(await Store.findAll());
  } catch (e) {
    next(e);
  }
});

stores.get("/:id", async (req: Request, res: Response, next) => {
  try {
    res.json(await Store.findOne({ where: { id: req.params["id"] } }));
  } catch (e) {
    next(e);
  }
});

stores.patch("/:id", async (req: Request, res: Response, next) => {
  try {
    const storeSelected = await Store.findOne({
      where: { id: req.params["id"] },
    });
    if (storeSelected) {
      if (
        req.body.storeType !== storeSelected.dataValues.storeType ||
        req.body.status !== storeSelected.dataValues.status ||
        (req.body.information &&
          req.body.information !== storeSelected.dataValues.information)
      ) {
        const updateStore = await Store.update<Store>(req.body, {
          where: { id: req.params["id"] },
        });
        res.status(200).json(req.body);
      } else {
        res.status(400).json(`No data to update`);
      }
    } else {
      res.status(400).json(`No store ID: ${req.params["id"]}`);
    }
  } catch (e) {
    next(e);
  }
});
