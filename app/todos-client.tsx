"use client";

import { useEffect, useState } from "react";
import type { Todo } from "@/app/types";
import { api } from "@/lib/api";

export default function TodosClient() {
    // null = not loaded yet (so we can render a Loading state)
    const [todos, setTodos] = useState<Todo[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [pending, setPending] = useState(false);

    // Load on mount
    useEffect(() => {
        (async () => {
            try {
                const data = await api<Todo[]>("/api/todos");
                setTodos(data);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "Failed to load";
                setError(message);
                setTodos([]); // stop spinner even on error
            }
        })();
    }, []);

    // --------- Render 4 states ---------
    if (todos === null) return <p>Loading…</p>;
    if (error) return <p style={{ color: "crimson" }}>Couldn’t load: {error}</p>;

    return (
        <section style={{ maxWidth: 520 }}>
            <h1>Todos</h1>

            {/* Create */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New todo"
                    disabled={pending}
                    aria-label="New todo title"
                    style={{ flex: 1 }}
                />
                <button onClick={handleAdd} disabled={pending || title.trim() === ""}>
                    {pending ? "Adding…" : "Add"}
                </button>
            </div>

            {/* Empty vs List */}
            {todos.length === 0 ? (
                <p>No todos yet.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {todos.map((t) => (
                        <li
                            key={t.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 0",
                                borderBottom: "1px solid #eee",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={t.completed}
                                onChange={() => toggle(t.id, !t.completed)}
                                aria-label={`Mark ${t.title} ${t.completed ? "incomplete" : "complete"}`}
                            />
                            <span style={{ flex: 1, opacity: t.completed ? 0.6 : 1 }}>
                                {t.title}
                            </span>
                            <button onClick={() => remove(t.id)} aria-label={`Delete ${t.title}`}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );

    // --------- Actions (optimistic) ---------
    async function handleAdd() {
        if (!todos) return;

        const clean = title.trim();
        if (!clean) return;

        setPending(true);

        // optimistic insert
        const draft: Todo = {
            id: "draft-" + (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)),
            title: clean,
            completed: false,
            createdAt: Date.now(),
        };
        const snapshot = todos.slice();
        setTodos([draft, ...todos]);

        try {
            const saved = await api<Todo>("/api/todos", {
                method: "POST",
                body: JSON.stringify({ title: clean }),
            });
            // replace draft with server-saved
            setTodos((curr) => curr!.map((t) => (t.id === draft.id ? saved : t))); // replace draft with server-saved
            setTitle(""); // clear input
        } catch {
            setTodos(snapshot);
            alert("Failed to create todo.");
        } finally {
            setPending(false);
        }
    }

    async function toggle(id: string, completed: boolean) {
        if (!todos) return;
        const snapshot = todos.slice();
        setTodos((curr) => curr!.map((t) => (t.id === id ? { ...t, completed } : t)));
        try {
            await api<Todo>(`/api/todos/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ completed }),
            });
        } catch {
            setTodos(snapshot);
            alert("Failed to update.");
        }
    }

    async function remove(id: string) {
        if (!todos) return;
        const snapshot = todos.slice();
        setTodos((curr) => curr!.filter((t) => t.id !== id));
        try {
            await api<Todo>(`/api/todos/${id}`, { method: "DELETE" });
        } catch {
            setTodos(snapshot);
            alert("Failed to delete.");
        }
    }
}
