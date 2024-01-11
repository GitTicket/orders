import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@gittrix/common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(
    data: { id: string; title: string; price: number; userId: string },
    message: Message
  ): Promise<void> {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    if (!ticket) {
      throw new Error(`Ticket not found ${id}`);
    }

    ticket.set({ title, price });
    await ticket.save();
    
    message.ack();
  }
}
