import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>{" "}
          </svg>
        </button>
      </div>
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost">
          Bonkers Split
        </Link>
      </div>
      <div className="flex-none">
        {authUser && (
          <button
            className="btn btn-ghost flex gap-2 items-center"
            onClick={logout}
          >
            <LogOut className="size-5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
