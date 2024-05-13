import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function deleteParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/participants/:id",
    {
      schema: {
        summary: "Delete a participant",
        tags: ["participants"],
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.undefined(), // No content for successful deletion
          404: z.object({
            message: z.string(),
          }), // Participant not found
          500: z.object({
            message: z.string(),
          }), // Internal server error
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      try {
        // Check if the participant exists
        const existingParticipant = await prisma.participant.findUnique({
          where: {
            id,
          },
        });

        if (!existingParticipant) {
          // Participant not found
          return reply.status(404).send({ message: "Participant not found" });
        }

        // Delete the participant
        await prisma.participant.delete({
          where: {
            id,
          },
        });

        // Successfully deleted
        return reply.status(204).send();
      } catch (error) {
        // Internal server error
        console.error("Error deleting participant:", error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
}
