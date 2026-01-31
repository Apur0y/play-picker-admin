import { useState } from "react"; // Import useState for managing dropdown state
import { IoLogOut } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Use react-router-dom instead of react-router
import type { NavLink } from "../types";
import Cookies from "js-cookie";

interface MainNavLinkProps {
  navLink: NavLink[];
  additionalRoutes: NavLink[] | null;
  setIsShort: React.Dispatch<React.SetStateAction<boolean>>;
  isShort: boolean;
  dark?: boolean;
}

export default function MainNavLink({
  navLink,
  additionalRoutes,
  setIsShort,
  dark = false,
}: MainNavLinkProps) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); 

  // Check if a link is active
  const isActive = (href: string) => {
    const cleanHref = href.split("?")[0];
    const cleanPathname = location.pathname.split("?")[0];

    // Exact match for dashboard routes
    if (cleanHref === "/dashboard") {
      return cleanPathname === "/dashboard";
    }
    if (cleanHref === "/admin-dashboard") {
      return cleanPathname === "/admin-dashboard";
    }

    // Partial match for other routes
    return cleanPathname.startsWith(cleanHref);
  };

  const navigate= useNavigate();

  // Handle logout
  const handleLogout = async () => {
    // Add your logout logic here
    Cookies.remove("adminToken")
    console.log("Logging out...");
    navigate("/")

  };

  // Toggle dropdown
  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
    console.log(openDropdown)
  };

  // Render navigation links with dropdown support
  const renderNavLink = (
    link: NavLink,

    setIsShort: React.Dispatch<React.SetStateAction<boolean>>,
    dark?: boolean
  ) => {
    const hasSubItems = link.subItems && link.subItems.length > 0;

    return (
      <div key={link.name}>
        {/* Dropdown Trigger */}
        <Link to={link.href}
          className={`flex items-center justify-between gap-3 px-3 py-3 rounded-md cursor-pointer  ${
            isActive(link.href)
              ? dark
                ? "bg-primary text-white"
                : "bg-primary text-white"
              : dark
              ? "text-black hover:bg-primary/40"
              : "hover:bg-white hover:text-white"
          }`}
          onClick={() => hasSubItems && toggleDropdown(link.name)}
          onMouseEnter={() => setIsShort(true)}
        >
        
            <Link
              to={link.href}
              className="flex items-center gap-3 flex-1 overflow-hidden"
            >
              <div className="rounded">
                {link.icon && <link.icon className="min-w-6 min-h-6" />}
              </div>
             <span className="text-nowrap">{link.name}</span>
            </Link>
      

          
        </Link>

     
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col min-h-screen  relative ${
        dark ? "bg-white text-black" : "bg-primary text-white"
      }`}
    >
      {/* <div className="lg:block absolute top-16 right-0 hidden z-50">
        <button
          className={`rounded-md  transition-colors w-fit shadow-md px-3 z-50 ${
            dark ? "bg-primary text-white" : "bg-white hover:bg-gray-100"
          }`}
          onClick={() => setIsShort(!isShort)}
          aria-label="Toggle menu"
        >
          {isShort ? (
            <LuChevronsRight
              className={`h-6 w-6  z-50 ${
                dark ? "hover:text-white" : "hover:text-primary"
              }`}
            />
          ) : (
            <LuChevronsLeft
              className={`h-6 w-6  z-50 ${
                dark ? "hover:text-white" : "hover:text-primary"
              }`}
            />
          )}
        </button>
      </div> */}


      {/* Navigation Links */}
      <nav className="flex-1 p-4 mt-2">
        <div className="space-y-1">
          {navLink.map((link) =>
            renderNavLink(link, setIsShort, dark)
          )}
        </div>
      </nav>

      {/* Additional Routes and User Section */}
      <div className="mt-auto p-4 space-y-1">
        {additionalRoutes?.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-md ${
              isActive(link.href)
                ? dark
                  ? ""
                  : "bg-primary text-white"
                : dark
                ? ""
                : "bg-primary text-white"
            }`}
          >
            <div className="rounded">
              {link.icon && <link.icon className="min-w-6 min-h-6" />}
            </div>
            {link.name}
          </Link>
        ))}

        {/* Logout Button */}
        <div
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer bg-gray-100 overflow-hidden`}
        >
          <IoLogOut
            className={`min-w-6 min-h-6 text-primary rotate-180`}
          />

            <span
              className={`text-nowrap text-primary`}
            >
              Log Out
            </span>
         
        </div>
      </div>
    </div>
  );
}
