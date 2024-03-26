import React, { useState } from "react";
import {
  Bars3Icon,
  HomeIcon,
  BriefcaseIcon,
  CogIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import Logout from "./Logout";

type NavigationItem = {
  name: string;
  href: string;
  current: boolean;
  icon: JSX.Element;
};

type SidebarProps = {
  onReduceChange: (reduced: boolean) => void;
};

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/home",
    current: true,
    icon: <HomeIcon className="h-5 w-5 mr-2" />,
  },
  {
    name: "Portfolios",
    href: "/portfolio",
    current: false,
    icon: <BriefcaseIcon className="h-5 w-5 mr-2" />,
  },
  {
    name: "Projects",
    href: "#",
    current: false,
    icon: <CogIcon className="h-5 w-5 mr-2" />,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ onReduceChange }) => {
  const [reduced, setReduced] = useState(false);

  const toggleReduce = () => {
    const newReduced = !reduced;
    setReduced(newReduced);
    onReduceChange(newReduced);
  };

  return (
    <div
      className={`bg-gray-800 min-h-screen lg:flex lg:flex-col ${reduced ? "lg:w-16" : "lg:w-54"}`}
    >
      <div className="px-2 py-4 lg:py-6 lg:px-4 flex items-center justify-between">
        {!reduced && (
          <div className="flex items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
            />
          </div>
        )}
        <div className="flex items-center">
          <button
            onClick={toggleReduce}
            className="text-gray-400 focus:outline-none"
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        className={`mt-4 lg:mt-8 lg:flex-grow lg:block ${reduced ? "hidden" : "block"}`}
      >
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <div className="flex items-center">
              {item.icon}
              {!reduced && item.name}
            </div>
          </a>
        ))}
      </div>
      <div
        className={`lg:absolute lg:bottom-0 lg:left-0 w-full lg:w-auto lg:py-4 lg:px-2 ${reduced ? "hidden" : "block"}`}
      >
        <Logout />
      </div>
      <div
        className={`lg:absolute lg:bottom-0 lg:left-0 w-full lg:w-auto lg:py-4 lg:px-2 ${!reduced ? "hidden" : "block"}`}
      >
        <a
          href="/logout"
          className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 hover:text-white"
        >
          <PowerIcon className="h-6 w-6 mr-2 text-gray-400" />
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
