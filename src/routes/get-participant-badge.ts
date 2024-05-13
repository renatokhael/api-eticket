import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/participants/:participantId/badge",
    {
      schema: {
        summary: "Get an participant badge",
        tags: ["participants"],
        params: z.object({
          participantId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInURL: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { participantId } = request.params;

      const participant = await prisma.participant.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true,
            },
          },
        },
        where: {
          id: participantId,
        },
      });

      if (participant === null) {
        throw new BadRequest("Attendee not found.");
      }

      const baseURL = `${request.protocol}://${request.hostname}`;

      const checkInURL = new URL(
        `/participants/${participantId}/check-in`,
        baseURL
      );

      return reply.send({
        badge: {
          name: participant.name,
          email: participant.email,
          eventTitle: participant.event.title,
          checkInURL: checkInURL.toString(),
        },
      });
    }
  );
}
