import React from "react";

const EditRoundButton: React.FC = () => {
  return(
  <div>
    <button className="flex items-center justify-center rounded-full bg-secondary p-2">
      <span  className="i-material-symbols-light-edit-square-outline w-8 h-8"></span>
    </button>
  </div>
  )
}
export default EditRoundButton;
