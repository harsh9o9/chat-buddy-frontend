/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import { requestHandler } from "../../utils";
import { createUserChat, getAvailableUsers } from "../../api";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Button from "../Button";
import Select from "../Select";
import { toast } from "react-toastify";

const AddChatModal = ({ open, onClose, onSuccess }) => {
  // State to store the list of users, initialized as an empty array
  const [users, setUsers] = useState([]);
  // State to determine if the chat is a group chat, initialized as false
  const [isGroupChat, setIsGroupChat] = useState(false);
  // State to store the ID of a selected user, initialized as null
  const [selectedUserId, setSelectedUserId] = useState(null);
  // State to determine if a chat is currently being created, initialized as false
  const [creatingChat, setCreatingChat] = useState(false);

  // Function to fetch users
  const getUsers = async () => {
    requestHandler(
      async () => await getAvailableUsers(),
      null, // No loading yet
      (res) => {
        const { data } = res;
        setUsers(data || []);
      },
      (message) => toast.error(message)
    );
  };

  // Function to reset local state values and close the modal/dialog
  const handleClose = () => {
    // Clear the list of users
    setUsers([]);
    // Reset the selected user ID
    setSelectedUserId("");
    onClose();
  };

  const createNewChat = async () => {
    // If no user is selected, show an toast alert
    if (!selectedUserId) return toast.info("Please select a user");

    // Handle the request to create a chat
    await requestHandler(
      async () => await createUserChat(selectedUserId),
      setCreatingChat, // for loading
      (res) => {
        const { data } = res;
        // If chat already exists with the selected user
        if (res.statusCode === 200) {
          toast.info("Chat with selected user already exists");
          return;
        }
        onSuccess(data);
        handleClose();
      },
      (message) => toast.error(message)
    );
  };

  const createNewGroupChat = () => {};

  useEffect(() => {
    // Check if the modal/dialog is not open
    if (!open) return;
    // Fetch users if the modal/dialog is open
    getUsers();
    // The effect depends on the 'open' value. Whenever 'open' changes, the effect will re-run.
  }, [open]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-visible">
          <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="relative transform overflow-x-hidden rounded-lg bg-gray-300 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6"
                style={{
                  overflow: "inherit",
                }}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-black"
                    >
                      Create chat
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md bg-transparent text-black hover:text-gray-800 focus:outline-none focus:ring-[3px] focus:ring-sky-500"
                      aria-label="Close"
                      onClick={() => handleClose()}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                {/* // TODO: uncomment it when I think about adding group chat functionality  */}
                {/* <Switch.Group as="div" className="flex items-center my-5">
                  <Switch
                    checked={isGroupChat}
                    onChange={setIsGroupChat}
                    className={`${
                      isGroupChat ? "bg-white" : "bg-gray-700"
                    } ${"relative outline outline-[1px] outline-black inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-[3px] focus:ring-sky-500"}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`
                       ${
                         isGroupChat
                           ? "translate-x-5 bg-green-500"
                           : "translate-x-0 bg-white"
                       } 
                        ${"pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out"}
                      `}
                    />
                  </Switch>
                  <Switch.Label as="span" className="ml-3 text-sm">
                    <span
                      className={`font-medium text-black ${
                        isGroupChat ? "" : "opacity-40"
                      }`}
                    >
                      Is it a group chat?
                    </span>{" "}
                  </Switch.Label>
                </Switch.Group> */}
                <div className="my-5">
                  <Select
                    placeholder={
                      isGroupChat
                        ? "Select group participants..."
                        : "Select a user to chat..."
                    }
                    value={isGroupChat ? "" : selectedUserId || ""}
                    options={users.map((user) => {
                      return {
                        label: user.username,
                        value: user._id,
                      };
                    })}
                    onChange={({ value }) => {
                      // TODO: Group chat
                      // if user is creating normal chat just get a single user
                      setSelectedUserId(value);
                    }}
                  />
                </div>
                <div className="mt-5 grid grid-cols-[1fr_1fr] gap-2">
                  <Button
                    disabled={creatingChat}
                    severity={"secondary"}
                    onClick={handleClose}
                    fullWidth={true}
                    className="text-black focus:ring-black"
                  >
                    Close
                  </Button>
                  <Button
                    disabled={creatingChat}
                    fullWidth={true}
                    className="text-white"
                    onClick={isGroupChat ? createNewGroupChat : createNewChat}
                  >
                    Create
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddChatModal;
