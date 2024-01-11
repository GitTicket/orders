import { Publisher, OrderCreatedEvent, Subjects } from "@gittrix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
