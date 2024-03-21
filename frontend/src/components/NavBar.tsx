import { Bars3Icon } from "@heroicons/react/24/solid";
import Logout from "./Logout";

type NavigationItem = {
  name: string;
  href: string;
  current: boolean;
};

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/home", current: true },
  { name: "Portfolios", href: "/portfolio", current: false },
  { name: "Projects", href: "#", current: false },
];

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar: React.FC = () => {
  return (
    <div className="bg-gray-800 h-screen fixed inset-y-0 left-0 w-64">
      <div className="px-2 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
            />
          </div>
          <div className="flex items-center">
            <Bars3Icon className="block h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-4">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block px-4 py-2 text-sm font-medium rounded-md"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-64 bg-gray-800 py-4 px-2">
        <Logout />
      </div>
    </div>
  );
};

export default Sidebar;
