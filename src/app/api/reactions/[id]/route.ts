import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";


export async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    if (req.method === "POST") {
      const { documentId, userId, emoji }: { documentId: number; userId: number; emoji: string } = await req.json();

      // Validate the input
      if (!documentId || !userId || !emoji) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }

      // Insert a new reaction into the reactions table
      await db.query(
        "INSERT INTO reactions (document_id, user_id, emoji) VALUES (?, ?, ?)",
        [documentId, userId, emoji]
      );

      return NextResponse.json({ message: "Reaction added successfully" });
    }

    if (req.method === "GET") {
      const { searchParams } = new URL(req.url);
      const documentId = searchParams.get("id");

      // Validate the documentId query parameter
      if (!documentId) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }


      // const query = `SELECT reactions.id, reactions.document_id, reactions.user_id, reactions.emoji, users.name AS user_name FROM reactions JOIN users ON reactions.user_id = users.id WHERE document_id = ? ORDER BY reactions.created_at DESC`

      // Fetch reactions for the specified document
      const [reactions] = await db.query(
        "SELECT reactions.id, reactions.document_id, reactions.user_id, reactions.emoji, reactions.created_at, users.name AS user_name " +
        "FROM reactions " +
        "JOIN users ON reactions.user_id = users.id " +
        "WHERE document_id = ? " +
        "ORDER BY reactions.created_at DESC",
        [documentId]
      );

      return NextResponse.json(reactions);
    }

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export const POST = handler;
export const GET = handler;