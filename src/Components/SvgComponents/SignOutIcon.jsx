const SignOutIcon = (props) => {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10 4H16V10"
                stroke={props.active ? 'white' : 'rgb(156 163 175)'}
                strokeWidth="2"
            />
            <path
                d="M16 4L8 12"
                stroke={props.active ? 'white' : 'rgb(156 163 175)'}
                strokeWidth="2"
            />
            <path
                d="M8 6H4V16H14V12"
                stroke={props.active ? 'white' : 'rgb(107 114 128)'}
                strokeWidth="2"
            />
        </svg>
    );
};

export default SignOutIcon;
