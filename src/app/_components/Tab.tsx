import React from "react";
import  Link  from "next/link";

const Tab: React.FC = () => {
  return(
  <div className="flex">
    <div className="w-1/2 p-2 text-center border border-primary solid rounded bg-primary text-white">
      <Link href="/diaries">
        日記一覧
      </Link>
    </div>
    <div className="w-1/2 p-2 text-center border border-primary solid rounded">
      <Link href="/summaries" >
        まとめ一覧
      </Link>
    </div>
  </div>
  )
}
export default Tab;