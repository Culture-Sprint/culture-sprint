
import { Link } from "react-router-dom";
import { Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary text-white flex items-center justify-center font-bold">
                CS
              </div>
              <span className="text-xl font-heading font-bold text-primary">
                Culture Sprint
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              A tool for participatory narrative inquiry and sensemaking
            </p>
            <div className="mt-4 flex space-x-4">
              <a 
                href="https://github.com/pdfernhout/narrafirma" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary"
              >
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary">Home</Link>
              </li>
              <li>
                <Link to="/collect" className="text-sm text-gray-600 hover:text-primary">Collect</Link>
              </li>
              <li>
                <Link to="/explore" className="text-sm text-gray-600 hover:text-primary">Explore</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary">Dashboard</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">Guides</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">API</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">Community</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary">License</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Culture Sprint. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
