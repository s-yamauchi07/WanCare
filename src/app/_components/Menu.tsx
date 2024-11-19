"use client"

import React from "react";

const menuList = [
  { name: "home", icon: "i-material-symbols-other-houses-outline-rounded"},
  { name: "記録", icon: "i-material-symbols-add-notes-outline"},
  { name: "カレンダー", icon: "i-material-symbols-calendar-month"},
  { name: "日記", icon: "i-material-symbols-book-2-outline"},
  { name: "マイページ", icon: "i-material-symbols-sound-detection-dog-barking-outline"},
]

const Menu: React.FC = () => {
  return(
    <div className="w-full">
      <ul className="text-center flex">
        {menuList.map((menu)=> {
          return(
            <li key={menu.name} className="w-full focus-within:z-10">
              <span className={menu.icon}></span>
              <p>{menu.name}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Menu;
