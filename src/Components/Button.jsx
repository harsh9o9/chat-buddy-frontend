/* eslint-disable react/prop-types */
const Button = ({
    fullWidth,
    severity = 'primary',
    size = 'base',
    disabled = false,
    ...props
}) => {
    return (
        <button
            disabled={disabled}
            {...props}
            className={`inline-flex flex-shrink-0 items-center justify-center rounded-full text-center shadow-sm focus:outline-none focus:ring-[3px] focus:ring-sky-500 ${
                fullWidth ? 'w-full' : ''
            } ${
                severity === 'secondary'
                    ? 'outline outline-[2px] outline-black/75 hover:bg-gray-400 disabled:bg-gray-400/50 '
                    : severity === 'danger'
                      ? 'bg-red-500 hover:bg-red-500/80 disabled:bg-red-500/50'
                      : 'bg-gray-900 hover:bg-gray-800 focus:bg-gray-800 disabled:bg-gray-600 disabled:text-gray-200 '
            } ${
                size === 'small' ? 'px-3 py-1.5 text-sm' : 'px-4 py-3 text-base'
            } 
      ${props?.className || ''}`}>
            {props.children}
        </button>
    );
};

export default Button;
