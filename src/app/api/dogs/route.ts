import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { formatDate } from "../../utils/dateFormat";
import { UserAuthentication } from "../../utils/userAuthentication";
import { handleError } from "../../utils/errorHandler";
import { Dog } from "@/_types/dog";

const prisma = new PrismaClient();

// 新規登録
export const POST = async(request: NextRequest) => {
  const { data, error } = await UserAuthentication(request);
  if (error) return handleError(error);

  try {
    const body = await request.json();
    const { imageKey, name, sex, birthDate, adoptionDate, breedId }:Dog = body;
    const currentUserId = data.user.id;
    const dog = await prisma.dog.findUnique({
      where: {
        ownerId: currentUserId
      },
    })

    // もし現在ログイン中のユーザーに既にペット情報が登録されていたらエラーを返す。
    if (dog) return handleError(new Error("dog information has already exist"));

    await prisma.dog.create({
      data: {
        imageKey,
        name,
        sex,
        birthDate: formatDate(birthDate),
        adoptionDate: formatDate(adoptionDate),
        breedId,
        ownerId: currentUserId,
      },
    })

    return NextResponse.json({ status: "OK", message: "ペット情報を登録しました"}, {status: 200 });
  } catch(error) {
    return handleError(error);
  }
}

// 詳細
export const GET = async(request: NextRequest) => {
  const { data, error } = await UserAuthentication(request);
  if (error) return handleError(error);

  try {
    const currentUserId = data.user.id;
    const dog = await prisma.dog.findUnique({
      where: {
        ownerId: currentUserId,
      },
    });

    return NextResponse.json({ status: "OK", dog: dog }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}


// 編集
export const PUT = async (request: NextRequest) => {
  const { error, data } = await UserAuthentication(request);
  if (error) return handleError(error);

  try {
    const body = await request.json();
    const { imageKey, name, sex, birthDate, adoptionDate, breedId }:Dog = body;

    const currentUserId = data.user.id;

    const dog = await prisma.dog.update({
      where: {
        ownerId: currentUserId,
      },
      data: {
        imageKey,
        name,
        sex,
        birthDate: formatDate(birthDate),
        adoptionDate: formatDate(adoptionDate),
        breedId,
      },
    });

    return NextResponse.json({ status: "OK", dog: dog }, { status: 200 })
  } catch (error) {
    return handleError(error);
  }
}

// 削除
export const DELETE = async (request: NextRequest) => {
  const { data, error } = await UserAuthentication(request);
  if (error) return handleError(error);

  const currentUserId = data.user.id;

  try {
    await prisma.dog.delete({
      where: {
        ownerId: currentUserId,
      },
    })

    return NextResponse.json({ status: "OK", message: "ペット情報を削除しました"}, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};


