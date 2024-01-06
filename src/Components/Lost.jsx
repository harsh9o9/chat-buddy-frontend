import { Link } from "react-router-dom";

const Lost = () => {
  return (
    <div className="bg-gray-300 flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-[15rem] p-0 leading-normal">404</h1>
        <p className="text-xl font-bold">Oops! Page not found</p>
        <p className="text-xl">
          we are sorry, but the page you requested was not found
        </p>
        <Link
          className="inline-block bg-gray-800 text-white text-[1.5rem] py-2 px-6 mt-4 rounded-md focus:outline-none focus:ring-[3px] focus:ring-sky-500"
          to={"login"}
          aria-label="Navigate to login or chats page, if authenticated"
        >
          Home
        </Link>
      </div>
    </div>
  );
};

export default Lost;
