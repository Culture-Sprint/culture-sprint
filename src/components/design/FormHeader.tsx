
import React from "react";

interface FormHeaderProps {
  title: string;
  description: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-brand-primary flex items-center">
        <span className="inline-block w-1 h-4 bg-brand-secondary rounded-full mr-2"></span>
        {title}
      </h3>
      <p className="text-sm text-gray-500 ml-3">{description}</p>
    </div>
  );
};

export default FormHeader;
