
import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  linkText,
  linkUrl,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-narrafirma-100 rounded-lg flex items-center justify-center text-narrafirma-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-narrafirma-950">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link to={linkUrl} className="text-narrafirma-600 hover:text-narrafirma-700 font-medium inline-flex items-center gap-1">
        {linkText}
        <ChevronRight size={16} />
      </Link>
    </div>
  );
};

export default FeatureCard;
