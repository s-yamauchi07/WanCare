import React from "react";

const careLists = [
  { name: "ごはん", icon: "tabler-dog-bowl" },
  { name: "水分", icon: "mdi-water" },
  { name: "さんぼ", icon: "mdi-dog-side" },
  { name: "おしっこ", icon: "mdi-toilet" },
  { name: "うんち", icon: "tabler-toilet-paper" },
  { name: "体重", icon: "icon-park-outline-weight" },
  { name: "くすり", icon: "hugeicons-medicine-02" },
  { name: "ワクチン", icon: "icon-park-outline-injection" },
  { name: "通院", icon: "ri-hospital-line" },
  { name: "トリミング", icon: "ri-scissors-2-fill"},
  { name: "シャンプー", icon: "tabler-bath" },
  { name: "爪切り", icon: "material-symbols-light-tools-pliers-wire-stripper" }
];

const SelectCare: React.FC = () => {
  return(
    <div className="flex justify-center">
      <div className="max-w-64 my-20 flex flex-col items-center">
        <p className="text-primary text-center text-lg font-bold mb-10">カテゴリーを選んでください</p>
        <div>
          <ul className="flex flex-wrap gap-x-8 gap-y-4">
            {careLists.map((careList) => {
              return(
                <li key={careList.name} className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-primary text-main w-16 h-16 flex items-center justify-center">
                    <span className={`i-${careList.icon} w-10 h-10`}></span>
                  </div>
                  <span className="text-gray-800 text-xs">{careList.name}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
export default SelectCare;
