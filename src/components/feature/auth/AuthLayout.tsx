import React from "react";
import { Outlet } from "react-router-dom";

interface AuthLayoutProps {
  sideComponent?: React.ReactNode;
  fullWidthSide?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Outlet/>
    </div>
  );
};

export default AuthLayout;
