"use client"

import React from "react";
import Link from "next/link";

const menuList = [
  { name: "home", icon: "i-material-symbols-other-houses-outline-rounded", path:"/"},
  { name: "記録", icon: "i-material-symbols-add-notes-outline", path: "/cares/new"},
  { name: "カレンダー", icon: "i-material-symbols-calendar-month", path:"/cares" },
  { name: "日記", icon: "i-material-symbols-book-2-outline", path: "/diaries"},
  { name: "マイページ", icon: "i-material-symbols-sound-detection-dog-barking-outline", path: "/mypages"},
]

const Menu: React.FC = () => {
  return(
    <div className="w-main fixed bottom-0">
      <ul className="text-center flex py-2 text-primary">
        {menuList.map((menu)=> {
          return(
            <li key={menu.name} className="w-full focus-within:z-10">
              <Link href={menu.path}>
                <span className={`${menu.icon} w-6 h-6`}></span>
              </Link>
              <p className="text-xs">{menu.name}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Menu;
