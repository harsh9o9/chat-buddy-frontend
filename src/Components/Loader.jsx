/* eslint-disable react/prop-types */
const Loader = (props) => {
    return (
        <div
            className={`flex items-center justify-center ${
                props?.className || ''
            }`}>
            <div className="loader"></div>
        </div>
    );
};

export default Loader;
