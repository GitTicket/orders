import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it("fetches orders for an particular user", async () => {
  // create three ticket
  const t1 = await buildTicket();
  const t2 = await buildTicket();
  const t3 = await buildTicket();

  const u1 = global.signin();
  const u2 = global.signin();
  // create one order as user #1

  await request(app)
    .post("/api/orders")
    .set("Cookie", u1)
    .send({ ticketId: t1.id })
    .expect(201);

  // create two orders as user #2
  const { body: o1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", u2)
    .send({ ticketId: t2.id })
    .expect(201);

  const { body: o2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", u2)
    .send({ ticketId: t3.id })
    .expect(201);

  // make request to get orders for user #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", u2)
    .expect(200);
  // make suer we only got the orders for user #2

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(o1.id);
  expect(response.body[1].id).toEqual(o2.id);
  expect(response.body[0].ticket.id).toEqual(t2.id);
  expect(response.body[1].ticket.id).toEqual(t3.id);
});
