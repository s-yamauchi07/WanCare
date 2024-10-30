import { NextResponse } from "next/server";

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }
};