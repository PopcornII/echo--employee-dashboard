import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";



export async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    if (req.method === "POST") {
      const { documentId, userId, emoji }: { documentId: number; userId: number; emoji: string } = await req.json();
      console.log(documentId, userId, emoji)

      // Validate the input
      if (!documentId || !userId || !emoji) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }

      const queryDB = `INSERT INTO reactions (document_id, user_id, emoji) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE emoji = ?`

      // Insert or update a reaction
      await db.query(
        queryDB,
        [documentId, userId, emoji, emoji]
      );

      return NextResponse.json({ message: "Reaction added or updated successfully" });
    }

    if (req.method === "GET") {
      const { searchParams } = new URL(req.url);
      const documentId = searchParams.get("id");
      const userId = searchParams.get("userId");


      // Validate query parameters
      if (!documentId || !userId) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }

      // Fetch user's previous reaction for the specified document
      const userReaction = await db.query(
        "SELECT emoji FROM reactions WHERE document_id = ? AND user_id = ? LIMIT 1",
        [documentId, userId]
      );

      // Fetch the total reactions grouped by emoji for the document
      const [reactionCounts] = await db.query(
        "SELECT emoji, COUNT(*) AS totalReactions FROM reactions WHERE document_id = ? GROUP BY emoji",
        [documentId]
      );

      return NextResponse.json({
        userReaction: userReaction.length ? userReaction[0] : null,
        reactionCounts,
      });
    }

    if (req.method === "DELETE") {
      const { documentId, userId }: { documentId: number; userId: number } = await req.json();

      // Validate the input
      if (!documentId || !userId) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }

      // Delete the reaction
      await db.query(
        "DELETE FROM reactions WHERE document_id = ? AND user_id = ?",
        [documentId, userId]
      );

      return NextResponse.json({ message: "Reaction deleted successfully" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const POST = handler;
export const GET = handler;
export const DELETE = handler;
