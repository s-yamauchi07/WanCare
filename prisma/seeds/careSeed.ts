import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export async function careSeed(prisma: PrismaClient) {
  const careLists = [
    { name: "ごはん", icon: "i-tabler-dog-bowl" },
    { name: "水分", icon: "i-mdi-water" },
    { name: "さんぽ", icon: "i-mdi-dog-side" },
    { name: "おしっこ", icon: "i-mdi-toilet" },
    { name: "うんち", icon: "i-tabler-toilet-paper" },
    { name: "体重", icon: "i-icon-park-outline-weight" },
    { name: "くすり", icon: "i-hugeicons-medicine-02" },
    { name: "ワクチン", icon: "i-icon-park-outline-injection" },
    { name: "通院", icon: "i-ri-hospital-line" },
    { name: "トリミング", icon: "i-ri-scissors-2-fill"},
    { name: "シャンプー", icon: "i-tabler-bath" },
    { name: "爪切り", icon: "i-material-symbols-light-tools-pliers-wire-stripper" }
  ];

  try {
    for (let i = 0; i < careLists.length; i++) {
      const care = careLists[i];
      await prisma.careList.upsert({
        where: { name: care.name},
        update: { name: care.name, icon: care.icon},
        create: {
          id: uuidv4(),
          name: care.name,
          icon: care.icon,
          order: i + 1,
        }
      })
    }
  } catch (error) {
    console.log(error)
    process.exit(1) 
  } finally {
    await prisma.$disconnect();
  }
}