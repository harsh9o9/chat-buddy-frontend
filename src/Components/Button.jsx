/* eslint-disable react/prop-types */
const Button = ({
  fullWidth,
  severity = "primary",
  size = "base",
  ...props
}) => {
  return (
    <button
      {...props}
      className={`rounded-full inline-flex flex-shrink-0 justify-center items-center text-center focus:outline-none focus:ring-[3px] focus:ring-sky-500 shadow-sm ${
        fullWidth ? "w-full" : ""
      } ${
        severity === "secondary"
          ? "hover:bg-gray-400 disabled:bg-gray-400/50 outline outline-[2px] outline-black/75 "
          : severity === "danger"
          ? "bg-red-500 hover:bg-red-500/80 disabled:bg-red-500/50"
          : "bg-gray-900 hover:bg-gray-800 disabled:bg-gray-600 disabled:text-gray-200 focus:bg-gray-800 "
      } ${size === "small" ? "text-sm px-3 py-1.5" : "text-base px-4 py-3"} 
      ${props?.className || ""}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
