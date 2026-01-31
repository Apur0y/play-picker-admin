import type { Dispatch, SetStateAction } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import type { User } from "../types";
import Logo from "../../shared/Logo";
import { useGetMeQuery } from "../../../redux/api/getMe/getMeApi";
import { Link } from "react-router-dom";

export default function TopBar({
  isOpen,
  setIsOpen,
  user,
  dark = false,
}: {
  user: null | User;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  dark?: boolean;
}) {

  const { data: userInfo } = useGetMeQuery({})
  console.log(user)

  return (
    <header className={`  shadow-md ${dark ? "bg-primary " : "bg-white"}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section: Toggle Button (Mobile) */}
        <button
          className={`xl:hidden p-2 rounded-md  transition-colors ${dark ? " " : "hover:bg-gray-100"
            }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <LuX
              className={`h-6 w-6  ${dark ? "text-white" : "text-gray-700"}`}
            />
          ) : (
            <LuMenu
              className={`h-6 w-6  ${dark ? "text-white " : "text-gray-700"}`}
            />
          )}
        </button>

        {/* Left Section: Welcome Message (Desktop) */}
        <div className="items-center gap-2 ">
          <Logo className="w-[93px] h-[68px]" />
        </div>


        <Link to="/dashboard/settings">


          <div className="flex items-center gap-3 px-3 py-3">

            <img
              src={userInfo?.data.avatar || "https://cdn-icons-png.freepik.com/256/18751/18751478.png?semt=ais_hybrid"}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-md"
            />
            <div className="flex-1">
              <div
                className={`font-medium ${dark ? "text-white" : "text-gray-500"}`}
              >
                {userInfo?.data.name || "John Doe"}
              </div>
              <div
                className={`text-xs  ${dark ? "text-white" : "text-gray-500"}`}
              >

              </div>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
