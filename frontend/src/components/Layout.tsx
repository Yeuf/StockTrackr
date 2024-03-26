import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useLocation } from "react-router-dom";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [showNavBar, setShowNavBar] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setShowNavBar(!location.pathname.includes("/login"));
  }, [location]);

  const handleReduceChange = () => {
    setReduced(!reduced);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`${showNavBar ? "lg:w-54" : "w-0"} lg:flex-shrink-0`}>
        {showNavBar && <NavBar onReduceChange={handleReduceChange} />}
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default Layout;
