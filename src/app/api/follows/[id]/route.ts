import { userAuthentication } from "@/app/utils/userAuthentication";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/app/utils/errorHandler";

export const POST = async(request: NextRequest, { params } : { params : Promise<{ id: string }>}) => {
  const { id } = await params;
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);

  const followingId = data.user.id;

  try {
    await prisma.follow.create({
      data: {
        followerId: id,
        followingId,
      },
    });

    return NextResponse.json({ status: "OK", message: "フォローしました" }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}

export const DELETE = async(request: NextRequest, { params} : { params : Promise<{ id: string }>}) => {
  const { id } = await params;
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);

  const followingId = data.user.id;

  try {
    await prisma.follow.delete({
      where: {
        followingId_followerId: {
          followerId: id,
          followingId,
        },
      },
    });

    return NextResponse.json({ status:"OK", message: "フォローを解除しました"}, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}