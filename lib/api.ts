export async function api<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
    console.log("res equals ", res.ok);
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<T>;
}
// A helper function to make API requests and parse JSON responses