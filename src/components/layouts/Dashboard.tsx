import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router";
import SideBar from "./navigationBar/SiderBar";
import TopBar from "./navigationBar/TopBar";
import { navLink } from "./Navlink";
// import Cookies from "js-cookie";


const DashboardLayout = () => {
  const user = null;
  const [isOpen, setIsOpen] = useState(false);
  const [isShort, setIsShort] = useState(true);

  // const navigate = useNavigate();
  // const token=Cookies.get("adminToken");
  // useEffect(() => {
  //   if (!token) {
  //     navigate("/");
  //   }
  // }, [token]);

 
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsShort(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navRef]);

  return (
    <div className="flex flex-col">
      <div className=" z-40">
        <TopBar
          dark={true}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          user={user}
        />
      </div>
      <div className="flex">


        <div className="max-h-screen h-full  sticky top-0 z-30 ">
          <SideBar
            dark={true}
            setIsShort={setIsShort}
            additionalRoutes={null}
            navLink={navLink}
            isOpen={isOpen}
            isShort={isShort}
            navRef={navRef}
          />
        </div>
       

          <div className=" min-h-screen space-y-2 w-full bg-background overflow-auto">
            {/* <BreadCrumb /> */}
            <Outlet />
          </div>
   
      </div>
    </div>
  );
};

export default DashboardLayout;
