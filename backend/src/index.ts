import express, { Request, Response } from "express";

// const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let storeList = [
  {
    id: 1,
    number: "A88",
    type: "Franczyza",
    status: "Nowy",
    info: "Wykaz placówek handowych_20150101",
  },
  {
    id: 2,
    number: "A88",
    type: "Franczyza",
    status: "Nowy",
    info: "Wykaz placówek handowych_20150101",
  },
  { id: 3, number: "A99", type: "Centrala", status: "Zamknięty" },
  { id: 4, number: "G99", type: "Multisambo", status: "Otwarty" },
];

let userList = [
  {
    id: 1,
    login: "admin",
    password: "admin123",
  },
];

app.get("/", (req: Request, res: Response) => {
  res.send("Helpdesk_APP");
});

app.post("/login", (req: Request, res: Response) => {
  res.send("GET request to homepage");
});

app.get("/shoplist/", (req: Request, res: Response) => {
  res.json(storeList);
});

storeList.map((store, id) => {
  app.get(`/shoplist/${store.id}`, (req: Request, res: Response) => {
    res.json(store);
  });
});

storeList.map((store, id) => {
  app.patch(`/shoplist/${store.id}`, (req: Request, res: Response) => {
    let newList = storeList.map((store) =>
      store.id === req.body.id ? req.body : store
    );
    res.status(200).end();
    storeList = newList;
  });
});

app.post("/shoplist/add", (req: Request, res: Response) => {
  storeList.push(req.body);
  res.status(200).end();
});

app.listen(8888, () => {
  console.log("Aplikacja działa na porcie 8888");
});
