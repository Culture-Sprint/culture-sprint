
import React from "react";
import AppearancePreview from "../AppearancePreview";

interface AppearancePreviewWrapperProps {
  appearance: any;
}

const AppearancePreviewWrapper: React.FC<AppearancePreviewWrapperProps> = ({ appearance }) => {
  return (
    <div>
      <AppearancePreview appearance={appearance} />
    </div>
  );
};

export default AppearancePreviewWrapper;
