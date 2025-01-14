import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export const GET = async(request: NextRequest) => {
  const {  error } = await userAuthentication(request);
  if (error) return handleError(error);

  try {
    const breeds = await prisma.breed.findMany({
      select: {
        id: true,
        name: true,
      }
    });

    return NextResponse.json({ status: "OK", breeds: breeds }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}