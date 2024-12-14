import { CareUnit } from "@/_types/care";

export const careUnitLists : { [key: string]: CareUnit } = {
  ごはん: { title: "食べた量", unit: "g" },
  水分: { title: "飲んだ量", unit: "ml" },
  さんぽ: { title: "歩いた時間", unit: "分" },
  おしっこ: { title:"回数", unit: "回" },
  うんち: { title: "回数", unit: "回" },
  体重: { title: "体重", unit: "kg" },
  くすり: { title: "1回の量", unit: "錠" },
};
