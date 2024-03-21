import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useLocation } from "react-router-dom";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [showNavBar, setShowNavBar] = useState(true);

  useEffect(() => {
    setShowNavBar(!location.pathname.includes("/login"));
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`${showNavBar ? 'lg:w-64' : 'w-0'} lg:flex-shrink-0`}>
        {showNavBar && <NavBar />}
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Layout;
