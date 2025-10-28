import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/todos/:id
export async function PATCH(
    req: Request,
    ctx: { params: Promise<{ id: string }> }   // ← note the Promise type
) {
    const { id } = await ctx.params;            // ← await params
    const i = db.todos.findIndex(t => t.id === id);
    if (i === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    if (typeof body.completed === "boolean") db.todos[i].completed = body.completed;
    if (typeof body.title === "string") db.todos[i].title = body.title.trim();

    return NextResponse.json(db.todos[i]);
}

// DELETE /api/todos/:id
export async function DELETE(
    _req: Request,
    ctx: { params: Promise<{ id: string }> }    // ← Promise here too
) {
    const { id } = await ctx.params;            // ← await params
    const i = db.todos.findIndex(t => t.id === id);
    if (i === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const [removed] = db.todos.splice(i, 1);
    return NextResponse.json(removed);
}
