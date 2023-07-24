import { NextResponse } from "next/server";

export function success(data: unknown) {
  return NextResponse.json(data);
}
