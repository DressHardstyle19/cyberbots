import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { botsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { CreateBotBody, GetBotParams, DeleteBotParams, VoteBotParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/bots", async (_req, res) => {
  try {
    const bots = await db.select().from(botsTable).orderBy(botsTable.createdAt);
    const mapped = bots.map((b) => ({
      ...b,
      inviteUrl: `https://discord.com/api/oauth2/authorize?client_id=${b.clientId}&permissions=8&scope=bot%20applications.commands`,
      createdAt: b.createdAt.toISOString(),
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/bots", async (req, res) => {
  try {
    const input = CreateBotBody.parse(req.body);
    const [bot] = await db
      .insert(botsTable)
      .values({
        clientId: input.clientId,
        name: input.name,
        description: input.description,
        avatarUrl: input.avatarUrl ?? null,
        prefix: input.prefix ?? null,
        tags: input.tags ?? [],
        featured: input.featured ?? false,
      })
      .returning();
    res.status(201).json({
      ...bot,
      inviteUrl: `https://discord.com/api/oauth2/authorize?client_id=${bot.clientId}&permissions=8&scope=bot%20applications.commands`,
      createdAt: bot.createdAt.toISOString(),
    });
  } catch (err: any) {
    if (err?.code === "23505") {
      res.status(400).json({ error: "A bot with this Client ID already exists" });
      return;
    }
    if (err?.issues) {
      res.status(400).json({ error: err.issues[0]?.message ?? "Invalid input" });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bots/:id", async (req, res) => {
  try {
    const { id } = GetBotParams.parse({ id: Number(req.params.id) });
    const [bot] = await db.select().from(botsTable).where(eq(botsTable.id, id));
    if (!bot) {
      res.status(404).json({ error: "Bot not found" });
      return;
    }
    res.json({
      ...bot,
      inviteUrl: `https://discord.com/api/oauth2/authorize?client_id=${bot.clientId}&permissions=8&scope=bot%20applications.commands`,
      createdAt: bot.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/bots/:id", async (req, res) => {
  try {
    const { id } = DeleteBotParams.parse({ id: Number(req.params.id) });
    const [bot] = await db.delete(botsTable).where(eq(botsTable.id, id)).returning();
    if (!bot) {
      res.status(404).json({ error: "Bot not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/bots/:id/vote", async (req, res) => {
  try {
    const { id } = VoteBotParams.parse({ id: Number(req.params.id) });
    const [existing] = await db.select().from(botsTable).where(eq(botsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Bot not found" });
      return;
    }
    const [updated] = await db
      .update(botsTable)
      .set({ votes: existing.votes + 1 })
      .where(eq(botsTable.id, id))
      .returning();
    res.json({
      ...updated,
      inviteUrl: `https://discord.com/api/oauth2/authorize?client_id=${updated.clientId}&permissions=8&scope=bot%20applications.commands`,
      createdAt: updated.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
