/* eslint-disable react/prop-types */
const Loader = (props) => {
    return (
        <div
            className={`loader-ctr flex items-center justify-center ${
                props?.className || ''
            }`}>
            <div className="loader"></div>
        </div>
    );
};

export default Loader;
