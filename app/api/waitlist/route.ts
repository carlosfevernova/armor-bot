import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.string().email().max(200),
  source: z.string().max(80).optional(),
});

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "invalid_input" },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServiceRole();
  const { data: existing } = await supabase
    .from("waitlist")
    .select("email")
    .eq("email", parsed.data.email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({
      ok: true,
      alreadyOnList: true,
      message: "Already on the list. Check your inbox on launch day.",
    });
  }

  const { error } = await supabase.from("waitlist").insert({
    email: parsed.data.email,
    source: parsed.data.source ?? "unknown",
  });
  if (error) {
    const missingTable = /relation .* does not exist/i.test(error.message);
    return NextResponse.json(
      { error: missingTable ? "waitlist table missing — run supabase-schema.sql once" : "insert_failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    alreadyOnList: false,
    message: "On the list. Watch for the install invite.",
  });
}
