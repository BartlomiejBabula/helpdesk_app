import { Request, Router, Response, NextFunction } from "express";
import { User } from "../models/User";
import { TOKEN } from "../app";

export const users = Router();
export const login = Router();
export const logout = Router();
export const auth = Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export const authJWTMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const access = req.headers["authorization"]?.split(" ")[1];
  const refresh = req.headers["authorization_refresh"]?.split(" ")[1];
  if (!access && !refresh) {
    return res.sendStatus(401);
  }
  jwt.verify(refresh, TOKEN, (e: any, data: any) => {
    if (e) {
      return res.sendStatus(401);
    }
    jwt.verify(access, TOKEN, (e: any, data: any) => {
      if (e) {
        return res.sendStatus(401);
      }
      req.user = data;
      next();
    });
  });
};

users.post("/", async (req: Request, res: Response, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
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
        let newUser: any = {
          email: req.body.email,
          password: await bcrypt.hash(req.body.password, salt),
        };
        const user = await User.create(newUser);
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
      const password_valid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (password_valid) {
        const payload = { id: user.id, email: user.email };
        const accessToken = jwt.sign(payload, TOKEN, { expiresIn: "300s" });
        const refreshToken = jwt.sign(payload, TOKEN, { expiresIn: "8h" });
        res.status(201).json({ accessToken, refreshToken });
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

logout.post("/", authJWTMiddleware, async (req: Request, res: Response) => {
  const token = req.body.refreshToken;
  res.status(200).json({ message: "You are logged out!" });
});

auth.post("/", async (req: Request, res: Response, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(403).json("Brak refresh tokena");
    }
    jwt.verify(refreshToken, TOKEN, (e: any, data: any) => {
      if (e) {
        return res.status(403).json("Błędny refresh token - sesja wygasła");
      }
      const payload = { id: data.id, email: data.email };
      const newAccessToken = jwt.sign(payload, TOKEN, { expiresIn: "300s" });
      res.status(201).json({ token: newAccessToken, refreshToken });
    });
  } catch (e) {
    next(e);
  }
});
