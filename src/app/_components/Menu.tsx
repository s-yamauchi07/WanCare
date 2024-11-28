"use client"

import React from "react";
import Link from "next/link";

const menuList = [
  { name: "home", icon: "i-material-symbols-other-houses-outline-rounded", path:"/"},
  { name: "記録", icon: "i-material-symbols-add-notes-outline", path: "/cares/new"},
  { name: "Calendar", icon: "i-material-symbols-calendar-month", path:"/cares" },
  { name: "日記", icon: "i-material-symbols-book-2-outline", path: "/diaries"},
  { name: "Mypage", icon: "i-material-symbols-sound-detection-dog-barking-outline", path: "/mypages"},
]

const Menu: React.FC = () => {
  return(
    <div className="fixed z-50 w-full h-16 max-w-md -translate-x-1/2 bg-secondary border border-secondary rounded-full bottom-4 left-1/2">
        <ul className="grid h-full max-w-md grid-cols-5 mx-auto">
          {menuList.map((menu) => {
            return(
              <li key={menu.name} className="inline-flex flex-col items-center justify-center px-4 rounded-full hover:bg-main group">
                <Link href={menu.path} className="inline-flex items-center">
                  <span className={`${menu.icon} w-6 h-6 group-hover:text-primary`}></span>
                </Link>
                <p className="text-xs group-hover:text-primary">{menu.name}</p>
              </li>
            )
          })}
        </ul>
    </div>
  )
}

export default Menu;
