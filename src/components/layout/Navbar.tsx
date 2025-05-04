
import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { session, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors ${
      isActive ? 'bg-gray-100' : ''
    }`;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center text-lg font-semibold">
          Culture Sprint
        </Link>

        <div className="flex items-center space-x-4">
          <NavLink to="/" className={getLinkClass}>Home</NavLink>
          <NavLink to="/about" className={getLinkClass}>About</NavLink>
          <NavLink to="/chat" className={getLinkClass}>AI Assistant</NavLink>
          
          {session && (
            <>
              <NavLink to="/design" className={getLinkClass}>Design</NavLink>
              <NavLink to="/collect" className={getLinkClass}>Collect</NavLink>
              <NavLink to="/analyze" className={getLinkClass}>Analyze</NavLink>
            </>
          )}
        </div>
        
        <div>
          {session ? (
            <Button variant="outline" size="sm" onClick={() => signOut()}>Logout</Button>
          ) : (
            location.pathname !== '/auth' && (
              <Button size="sm" onClick={() => navigate('/auth')}>Login</Button>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
