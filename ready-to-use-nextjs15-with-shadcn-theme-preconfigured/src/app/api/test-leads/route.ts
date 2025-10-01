// app/api/leads/route.ts
import { NextResponse } from "next/server";
// import { z } from "zod";

// Mock DB - replace with your real DB query
function makeMockData(total = 137) {
    const data = Array.from({ length: total }).map((_, i) => ({
        _id: String(i + 1),
        name: `Lead ${i + 1}`,
        email: `lead${i + 1}@example.com`,
        phone: `+92300${100000 + i}`,
        createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
    }));
    return data;
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const params = url.searchParams;
    const page = Number(params.get("page") ?? 1);
    const pageSize = Number(params.get("pageSize") ?? 10);
    const name = params.get("name") ?? "";

    // implement simple filtering/pagination (replace with DB query in production)
    const all = makeMockData(200);
    const filtered = name
        ? all.filter((l) => l.name.toLowerCase().includes(name.toLowerCase()))
        : all;
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    // simulate a slight delay
    await new Promise((r) => setTimeout(r, 120));

    return NextResponse.json({
        data: paged,
        total,
        page,
        pageSize,
    });
}
