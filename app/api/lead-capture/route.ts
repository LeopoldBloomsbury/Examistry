import { NextResponse } from "next/server";
import { leadCaptureSchema } from "@/lib/validation/schemas";
import { captureLead } from "@/lib/commerce";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = leadCaptureSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    const result = await captureLead(parsed.data);

    return NextResponse.json({
      message: result.message,
      guide: result.guide,
      relatedPack: result.relatedPack
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Guide capture failed." },
      { status: 400 }
    );
  }
}
