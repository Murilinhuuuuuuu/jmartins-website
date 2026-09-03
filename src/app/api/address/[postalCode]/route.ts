import { NextResponse } from "next/server";
import { findAddress } from "@/lib/address/provider";

export async function GET(_: Request, { params }: { params: Promise<{ postalCode: string }> }) {
  const address = await findAddress((await params).postalCode);
  if (!address) return NextResponse.json({ message: "CEP não encontrado." }, { status: 404 });
  return NextResponse.json(address, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
}
