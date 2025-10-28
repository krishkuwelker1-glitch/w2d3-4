"use client";

export type Todo = {
    id: string;
    title: string;
    completed: boolean;
    createdAt: number;
};

export default function TodoList({
    todos,
    onToggle,
    onDelete,
}: {
    todos: Todo[];
    onToggle: (id: string) => void; // child reports intent; parent updates state/server
    onDelete: (id: string) => void;
}) {
    if (todos.length === 0) {
        return <p style={{ color: "#666" }}>No items yet. Add one above.</p>;
    }

    return (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {todos.map((t) => (
                <li
                    key={t.id}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "24px 1fr auto",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 0",
                        borderBottom: "1px solid #eee",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => onToggle(t.id)} // NOTE: we pass only id here
                        aria-label={`Toggle ${t.title}`}
                    />
                    <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>
                        {t.title}
                    </span>
                    <button onClick={() => onDelete(t.id)} aria-label={`Delete ${t.title}`}>
                        ✕
                    </button>
                </li>
            ))}
        </ul>
    );
}
