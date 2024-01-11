import "express-async-errors";
import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@gittrix/common";

import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { listOrderRouter } from "./routes/list";
import { deleteOrderRouter } from "./routes/delete";

const app = express();
app.set("trust proxy", true);

// Middlewares
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);
app.use(currentUser);

// Routers
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(listOrderRouter);
app.use(deleteOrderRouter);

app.use(errorHandler);

app.all("*", async () => {
  throw new NotFoundError();
});

export { app };
