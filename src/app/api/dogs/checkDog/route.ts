import { handleError } from "@/app/utils/errorHandler";
import { NextResponse, NextRequest } from "next/server";
import { DogResponse } from "@/_types/dog";
import prisma from "@/libs/prisma";

export const POST = async(request: NextRequest) => {
  const body = await request.json();
  const { userId } = body;

  try {
    const dogRecord  = await prisma.dog.findUnique({
      where: {
        ownerId: userId,
      },
    });

    if (dogRecord) {
      const dogResponse: DogResponse = {
        ...dogRecord,
        birthDate: dogRecord.birthDate.toISOString(), 
        adoptionDate: dogRecord.adoptionDate.toISOString(),
      };
      return NextResponse.json({ status: "OK", dog: dogResponse }, { status: 200 });
    }
  } catch (error) {
    return handleError(error);
  }
}