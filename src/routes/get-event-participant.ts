import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEventParticipants(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/participants",
    {
      schema: {
        summary: "Get event participants",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          query: z.string().nullish(),
          pageIndex: z.string().nullish().default("0").transform(Number),
        }),
        response: {
          200: z.object({
            participants: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkedInAt: z.date().nullable(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { pageIndex, query } = request.query;

      const [participants, total] = await Promise.all([
        prisma.participant.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            checkIn: {
              select: {
                createdAt: true,
              },
            },
          },
          where: query
            ? {
                eventId,
                name: {
                  contains: query,
                },
              }
            : {
                eventId,
              },
          take: 10,
          skip: pageIndex * 10,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.participant.count({
          where: query
            ? {
                eventId,
                name: {
                  contains: query,
                },
              }
            : {
                eventId,
              },
        }),
      ]);

      return reply.send({
        participants: participants.map((participant) => {
          return {
            id: participant.id,
            name: participant.name,
            email: participant.email,
            createdAt: participant.createdAt,
            checkedInAt: participant.checkIn?.createdAt ?? null,
          };
        }),
        total,
      });
    }
  );
}
