"use client";

import React, { useEffect, useState }  from "react";
import { usePathname } from "next/navigation";
import  Link  from "next/link";

const Tab: React.FC = () => {
  const pathName = usePathname();
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const path = pathName;
    if(path.includes("/diaries")) {
      setActiveTab("diaries");
    } else if (path.includes("/summaries")) {
      setActiveTab("summaries");
    }
  }, [pathName]);

  return(
  <div className="flex">
    <div 
      className={`w-1/2 p-2 text-center border border-primary solid rounded ${activeTab === "diaries" ? "bg-primary text-white" : "text-gray-800" }`}
      onClick={() => setActiveTab("diaries")}
    >
      <Link href="/diaries">
        日記一覧
      </Link>
    </div>
    <div 
      className={`w-1/2 p-2 text-center border border-primary solid rounded ${activeTab === "summaries" ? "bg-primary text-white": "text-gray-800"}`}
      onClick={() => setActiveTab("summaries")}
    >
      <Link href="/summaries" >
        まとめ一覧
      </Link>
    </div>
  </div>
  )
}
export default Tab;