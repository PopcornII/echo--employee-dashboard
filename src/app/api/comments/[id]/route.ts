import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";


export async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    if (req.method === "POST") {
      const { documentId, userId, content }: { documentId: number; userId: number; content: string } = await req.json();

      // Validate the input
      if (!documentId || !userId || !content) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }

      // Insert a new comment into the comments table
      await db.query(
        "INSERT INTO comments (document_id, user_id, content) VALUES (?, ?, ?)",
        [documentId, userId, content]
      );

      return NextResponse.json({ message: "Comment added successfully" });
    }

    if (req.method === "GET") {
      const { searchParams } = new URL(req.url);
      console.log(searchParams)
      const documentId = searchParams.get("id");
      console.log(documentId)

      // Validate the documentId query parameter
      if (!documentId) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }

      // Fetch comments for the specified document
      const [comments] = await db.query(
        "SELECT comments.id, comments.document_id, comments.user_id, comments.content, comments.created_at, users.name AS user_name " +
        "FROM comments " +
        "JOIN users ON comments.user_id = users.id " +
        "WHERE document_id = ? " +
        "ORDER BY comments.created_at DESC",
        [documentId]
      );

      return NextResponse.json(comments);
    }

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export const POST = handler;
export const GET = handler;
