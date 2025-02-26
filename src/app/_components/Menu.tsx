"use client"

import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'

const menuList = [
  { name: "home", icon: "i-material-symbols-other-houses-outline-rounded", path:"/home"},
  { name: "記録", icon: "i-material-symbols-add-notes-outline", path: "/cares/new"},
  { name: "Calendar", icon: "i-material-symbols-calendar-month", path:"/cares" },
  { name: "日記", icon: "i-material-symbols-book-2-outline", path: "/diaries"},
  { name: "Mypage", icon: "i-material-symbols-sound-detection-dog-barking-outline", path: "/mypage"},
]

const excludedPaths = ["/", "/signup", "/signin", "/dogs/new", "/dogs/form"];

const Menu: React.FC = () => {
  const pathName = usePathname();
  const showMenu = !excludedPaths.includes(pathName);

  if (!showMenu) return null;

  return(
    <div className="fixed z-50 w-full h-16 max-w-md -translate-x-1/2 bg-main border-main rounded-full bottom-0.5 left-1/2 shadow-2xl">
        <ul className="grid h-full max-w-md grid-cols-5 mx-auto">
          {menuList.map((menu) => {
            return(
              <li key={menu.name} className="inline-flex flex-col items-center justify-center px-4 rounded-full hover:bg-primary group">
                <Link href={menu.path} className="inline-flex items-center">
                  <span className={`${menu.icon} w-6 h-6 text-primary group-hover:text-main`}></span>
                </Link>
                <p className="text-xs text-primary group-hover:text-main">{menu.name}</p>
              </li>
            )
          })}
        </ul>
    </div>
  )
}

export default Menu;
