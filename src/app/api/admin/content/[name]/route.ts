import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/db";
import { getArticles } from "@/lib/articles";
import { TAROT_CARDS } from "@/lib/engines/tarot-data";
import { LOT_SETS } from "@/lib/engines/lots-data";
import { DEFAULT_COPY } from "@/lib/engines/horoscope-copy";

const NAMES = new Set([
  "homepage",
  "articles",
  "features",
  "seo",
  "tarot-cards",
  "lots",
  "horoscope-copy",
]);

async function fallbackOf(name: string): Promise<unknown> {
  switch (name) {
    case "tarot-cards":
      return TAROT_CARDS;
    case "lots":
      return LOT_SETS;
    case "horoscope-copy":
      return DEFAULT_COPY;
    case "articles":
      return getArticles();
    case "features":
      return { hidden: [], order: [] };
    default:
      return {};
  }
}

type Ctx = { params: Promise<{ name: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { name } = await params;
  if (!NAMES.has(name)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const data = await readContent(name, await fallbackOf(name));
  return NextResponse.json({ data });
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { name } = await params;
  if (!NAMES.has(name)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const body = await req.json().catch(() => undefined);
  if (body === undefined) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  await writeContent(name, body);
  return NextResponse.json({ ok: true });
}
