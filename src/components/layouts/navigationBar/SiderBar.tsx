import type { NavLink } from "../types";
import MainNavLink from "./Navlink";

export default function SideBar({
  navRef,
  isOpen,
  isShort,
  additionalRoutes,
  navLink,
  setIsShort,
  dark,
}: {
  navRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  isShort: boolean;
  navLink: NavLink[];
  additionalRoutes: NavLink[] | null;
  setIsShort: React.Dispatch<React.SetStateAction<boolean>>;
  dark?: boolean;
}) {


  return (
    <div ref={navRef && navRef} className=" flex relative ">
      <div className="bg-amber-300/20 ">
        <div
          className={`absolute inset-y-0 left-0 z-40 w-64 md:w-56 lg:w-72 shadow-md transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <MainNavLink
            dark={dark}
            isShort={isShort}
            setIsShort={setIsShort}
            additionalRoutes={additionalRoutes}
            navLink={navLink}
          />
        </div>
      </div>
      {/* Sidebar for large screens */}
      <div
        className={`hidden xl:block h-full shadow-md  ${
          isShort
            ? "translate-x-0 lg:w-72 transition-all duration-300 ease-in-out"
            : " transition-all lg:w-20 duration-300 ease-in-out"
        }`}
      >
        <MainNavLink
          dark={dark}
          isShort={isShort}
          setIsShort={setIsShort}
          additionalRoutes={additionalRoutes}
          navLink={navLink}
        />
      </div>

      
    </div>
  );
}
