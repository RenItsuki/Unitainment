import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      where: {
        status: "SUCCESS",
        isPublic: true,
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        donorName: true,
        message: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json({ donations });
  } catch (error) {
    console.warn("Could not retrieve donations:", error);
    return NextResponse.json({ donations: [] });
  }
}
