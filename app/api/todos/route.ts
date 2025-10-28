// app/api/todos/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";        // adjust path if using alias
import { Todo } from "@/app/types";

export async function GET() {
    // List all todos
    return NextResponse.json(db.todos); // 200 by default
}

export async function POST(req: Request) {
    // Create a todo
    const { title } = await req.json();

    if (!title || typeof title !== "string") {
        return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    const todo: Todo = {
        id: crypto.randomUUID(),     // unique id (Node/Web crypto)
        title: title.trim(),
        completed: false,
        createdAt: Date.now(),
    };

    db.todos.unshift(todo);        // put new items at the top
    return NextResponse.json(todo, { status: 201 }); // 201 = created
}
