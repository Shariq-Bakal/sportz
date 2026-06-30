import { Router } from "express";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import { db } from "../db/db.js";
import { matches } from "../db/schema.js";
import { getMatchStatus } from "../utils/match-status.js";
import { desc } from "drizzle-orm";

export const matchesRouter = Router();
const MAX_LIMIT = 100;

matchesRouter.get("/", async (req, res) => {
   const parsed = listMatchesQuerySchema.safeParse(req.query);

   if (!parsed.success) {
      return res.status(400).json({
         message: "Invalid query",
         details: parsed.error.flatten()
      });
   }

   const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);

   try {
      const data = await db
         .select()
         .from(matches)
         .orderBy(desc(matches.createdAt))
         .limit(limit);

      return res.status(200).json({ data });

   } catch (error) {
      return res.status(500).json({
         message: "Failed to fetch matches"
      });
   }
});

matchesRouter.post("/", async (req, res) => {
    const parsed = createMatchSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid data"
        });
    }

    const { startTime, endTime, homeScore, awayScore } = parsed.data;

    try {
        const [event] = await db.insert(matches).values({
            ...parsed.data,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime)
        }).returning();

        return res.status(201).json({
            success: true,
            data: event
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create a match"
        });
    }
});