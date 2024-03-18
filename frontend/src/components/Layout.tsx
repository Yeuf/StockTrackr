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
    <div>
      {showNavBar && <NavBar />}
      {children}
    </div>
  );
};

export default Layout;
