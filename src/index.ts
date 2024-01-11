import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { Stan } from "node-nats-streaming";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";

const initilizeListener = (client: Stan) => {
  new TicketCreatedListener(client).listen();
  new TicketUpdatedListener(client).listen();
  console.log("Started the listeners");
};

const initilizeNATS = async () => {
  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID!,
    process.env.NATS_CLIENT_ID!,
    process.env.NATS_URL!
  );
  natsWrapper.client.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });
  process.on("SIGINT", () => natsWrapper.client.close());
  process.on("SIGTERM", () => natsWrapper.client.close());

  initilizeListener(natsWrapper.client);
};

const initilizeMongo = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("Connected to MongoDb");
};

const start = async () => {
  console.log("Starting......");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  await initilizeNATS();
  await initilizeMongo();

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
