import React from "react";
import { OptionProps } from "react-select";
import { Option } from "../_types/Option";

const DiarySelection: React.FC<OptionProps<Option>> = (props) => {
  return(
    <div className="w-full">
      <input 
        type="checkbox"
        id={props.data.id}
        onChange={() => props.selectOption(props.data)}
        checked={props.isSelected}
        className="m-2 rounded-full border border-primary"
      />
      <label htmlFor={props.data.id}>
        {props.data.title}
      </label>
    </div>
  )
}

export default DiarySelection;