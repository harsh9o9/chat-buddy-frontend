import { Link } from 'react-router-dom';

const Lost = () => {
    return (
        <div className="flex h-[100svh] items-center justify-center bg-gray-300">
            <div className="text-center">
                <h1 className="p-0 text-[15rem] leading-normal">404</h1>
                <p className="text-xl font-bold">Oops! Page not found</p>
                <p className="text-xl">
                    we are sorry, but the page you requested was not found
                </p>
                <Link
                    className="mt-4 inline-block rounded-md bg-gray-800 px-6 py-2 text-[1.5rem] text-white focus:outline-none focus:ring-[3px] focus:ring-sky-500"
                    to={'login'}
                    aria-label="Navigate to login or chats page, if authenticated">
                    Home
                </Link>
            </div>
        </div>
    );
};

export default Lost;
