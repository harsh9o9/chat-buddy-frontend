/* eslint-disable react/prop-types */
import { useId } from "react";

const Input = ({ label, fullWidth = true, ...props }) => {
  const id = useId();
  return (
    <div className={fullWidth ? "w-full" : ""}>
      <label htmlFor={id} className="text-xs">
        {label}
      </label>
      <input
        {...props}
        id={id}
        className={`block h-10 focus:bg-white outline-none pb-2 px-2 border-b-2 border-gray-800 ${
          fullWidth ? "w-full" : ""
        } ${props?.className || ""}`}
      />
    </div>
  );
};

export default Input;
