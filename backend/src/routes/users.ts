import { Request, Router, Response, NextFunction } from "express";
import { User } from "../models/User";
import { AuthToken } from "./../models/AuthToken";
import { TOKEN, REFRESH_TOKEN } from "../app";

export const users = Router();
export const login = Router();
export const logout = Router();
export const auth = Router();

const jwt = require("jsonwebtoken");

export const authJWTMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, TOKEN, (e: any, data: any) => {
    if (e) {
      return res.sendStatus(401);
    }
    req.user = data;
    next();
  });
};

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

users.get("/", authJWTMiddleware, async (req: Request, res: Response, next) => {
  try {
    res.json(await User.findAll());
  } catch (e) {
    next(e);
  }
});

users.get(
  "/:id",
  authJWTMiddleware,
  async (req: Request, res: Response, next) => {
    try {
      if (req.params["id"] === "profile") {
        const JWT = jwt.verify(
          req.headers["authorization"]?.split(" ")[1],
          TOKEN
        );
        const user: any = await User.findOne({ where: { id: JWT.id } });
        return res.json({
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        });
      }

      res.json(await User.findOne({ where: { id: req.params["id"] } }));
    } catch (e) {
      next(e);
    }
  }
);

users.patch(
  "/:id",
  authJWTMiddleware,
  async (req: Request, res: Response, next) => {
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
  }
);

login.post("/", async (req: Request, res: Response, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      if (user.password === req.body.password) {
        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, TOKEN, { expiresIn: "300s" });
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN);
        await AuthToken.create<any>({ refreshToken: refreshToken });
        res.status(201).json({ token, refreshToken });
      } else {
        res.status(401).json(`Błędne hasło`);
      }
    } else {
      res
        .status(401)
        .json(`Brak użytkownika z adresem email ${req.body.email}`);
    }
  } catch (e) {
    next(e);
  }
});

logout.delete("/", authJWTMiddleware, async (req: Request, res: Response) => {
  const token = req.body.refreshToken;
  await AuthToken.destroy({ where: { refreshToken: token } });
  res.sendStatus(204);
});

auth.post("/", async (req: Request, res: Response, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    const token = await AuthToken.findOne({
      where: { refreshToken: req.body.refreshToken },
    });
    if (!token) {
      return res.sendStatus(403);
    }
    jwt.verify(token.refreshToken, REFRESH_TOKEN, (e: any, data: any) => {
      if (e) {
        return res.sendStatus(403);
      }
      const payload = { id: data.id, email: data.email };
      const newAccessToken = jwt.sign(payload, TOKEN, { expiresIn: "300s" });
      res.status(201).json({ token: newAccessToken, refreshToken });
    });
  } catch (e) {
    next(e);
  }
});
