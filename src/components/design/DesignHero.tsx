
import React from "react";

const DesignHero: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-brand-secondary">
          <img src="/cs_logo.png" alt="Culture Sprint Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Culture Sprint Design</h1>
          <div className="h-1 w-24 bg-brand-secondary rounded-full mt-1"></div>
        </div>
      </div>
      <p className="text-lg text-gray-600">
        Follow these structured steps to plan and implement your participatory narrative inquiry project.
      </p>
    </div>
  );
};

export default DesignHero;
