import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export async function careSeed(prisma: PrismaClient) {
  const careLists = [
    { name: "ごはん", icon: "tabler-dog-bowl" },
    { name: "水分", icon: "mdi-water" },
    { name: "さんぼ", icon: "mdi-dog-side" },
    { name: "おしっこ", icon: "mdi-toilet" },
    { name: "うんち", icon: "tabler-toilet-paper" },
    { name: "体重", icon: "icon-park-outline-weight" },
    { name: "くすり", icon: "cuida-medicine-outline" },
    { name: "ワクチン", icon: "icon-park-outline-injection" },
    { name: "通院", icon: "ri-hospital-line" },
    { name: "トリミング", icon: "ri-scissors-2-fill"},
    { name: "シャンプー", icon: "tabler-bath" },
    { name: "爪切り", icon: "material-symbols-light-tools-pliers-wire-stripper" }
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