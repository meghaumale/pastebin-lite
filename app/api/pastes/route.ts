import { Redis } from "@upstash/redis";
import { nanoid } from "nanoid";

const redis = Redis.fromEnv();

export async function POST(req) {
  const { content } = await req.json();

  if (!content) {
    return new Response(JSON.stringify({ error: "No content" }), {
      status: 400,
    });
  }

  const id = nanoid(8);
  await redis.set(`paste:${id}`, content);

  return new Response(
    JSON.stringify({ url: `/${id}` }),
    { status: 200 }
  );
}