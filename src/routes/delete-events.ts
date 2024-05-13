import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function deleteEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/events/:eventId",
    {
      schema: {
        summary: "Deletar Evento",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          204: z.undefined(), // No content for successful deletion
          404: z.object({
            message: z.string(),
          }), // Event not found
          500: z.object({
            message: z.string(),
          }), // Internal server error
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;

      try {
        // Check if the event exists
        const existingEvent = await prisma.event.findUnique({
          where: {
            id: eventId,
          },
        });

        if (!existingEvent) {
          // Event not found
          return reply.status(404).send({ message: "Event not found" });
        }

        // Delete the event
        await prisma.event.delete({
          where: {
            id: eventId,
          },
        });

        // Successfully deleted
        return reply.status(204).send();
      } catch (error) {
        // Internal server error
        console.error("Error deleting event:", error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
}
