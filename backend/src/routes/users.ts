import { Request, Router, Response } from "express";
import { User } from "../models/User";

export const users = Router();

users.post("/", async (req: Request, res: Response, next) => {
  try {
    const newUser = req.body;
    let newUserExist: boolean = false;
    if (newUser.email && newUser.password) {
      const emailList = await User.findAll({ attributes: ["email"] });
      emailList.filter(
        (email) =>
          email.dataValues.email === newUser.email && (newUserExist = true)
      );
      if (newUserExist) {
        res.status(400).json(`User exist with email address: ${newUser.email}`);
      } else {
        const user = await User.create(req.body);
        res.status(201).json(user);
      }
    } else {
      res.status(400).json("User need to requaried email and password");
    }
  } catch (e) {
    next(e);
  }
});

users.get("/", async (req: Request, res: Response, next) => {
  try {
    res.json(await User.findAll());
  } catch (e) {
    next(e);
  }
});

users.get("/:id", async (req: Request, res: Response, next) => {
  try {
    res.json(await User.findOne({ where: { id: req.params["id"] } }));
  } catch (e) {
    next(e);
  }
});

users.patch("/:id", async (req: Request, res: Response, next) => {
  try {
    const userSelected = await User.findOne({
      where: { id: req.params["id"] },
    });
    if (userSelected) {
      if (
        req.body.email !== userSelected.dataValues.email ||
        req.body.password !== userSelected.dataValues.password
      ) {
        if (req.body.email !== userSelected.dataValues.email) {
          let emailExist: boolean = false;
          const emailList = await User.findAll({ attributes: ["email"] });
          emailList.filter(
            (email) =>
              email.dataValues.email === req.body.email && (emailExist = true)
          );
          if (emailExist) {
            res
              .status(400)
              .json(`User exist with email address: ${req.body.email}`);
          }
        }
        const updateUser = await User.update<User>(req.body, {
          where: { id: req.params["id"] },
        });
        res.status(200).json(req.body);
      } else {
        res.status(400).json(`No data to update`);
      }
    } else {
      res.status(400).json(`No user ID: ${req.params["id"]}`);
    }
  } catch (e) {
    next(e);
  }
});
