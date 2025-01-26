import React, { useState }  from "react";
import  Link  from "next/link";

const Tab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("diaries");

  return(
  <div className="flex">
    <div 
      className={`w-1/2 p-2 text-center border border-primary solid rounded ${activeTab === "diaries" ? "bg-primary text-white" : "" }`}
      onClick={() => setActiveTab("diaries")}
    >
      <Link href="/diaries">
        日記一覧
      </Link>
    </div>
    <div 
      className={`w-1/2 p-2 text-center border border-primary solid rounded ${activeTab === "summaries" ? "bg-primary text-white": ""}`}
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