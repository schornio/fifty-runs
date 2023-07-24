import { NextResponse } from "next/server";

export function badRequest(error: string) {
  return NextResponse.json(
    {
      error,
    },
    {
      status: 400,
    }
  );
}
