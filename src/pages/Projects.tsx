
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import ProjectsContainer from "@/components/projects/ProjectsContainer";

const Projects = () => {
  return (
    <PageLayout>
      <div className="p-8">
        <ProjectsContainer />
      </div>
    </PageLayout>
  );
};

export default Projects;
