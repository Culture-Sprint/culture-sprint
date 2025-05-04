
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useProject } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Import the design data
import { designPhases } from "@/data/designPhases";

// Import the components
import DesignHero from "@/components/design/DesignHero";
import DesignPhaseCard from "@/components/design/DesignPhaseCard";
import PhaseHeader from "@/components/design/PhaseHeader";
import PhaseProgress from "@/components/design/PhaseProgress";
import DesignAssistant from "@/components/design/DesignAssistant";
import RefreshProjectContextButton from "@/components/design/RefreshProjectContextButton";
import { useDatabaseDebug } from "@/hooks/useDatabaseDebug";

const Design = () => {
  const navigate = useNavigate();
  const {
    activeProject
  } = useProject();
  const [searchParams] = useSearchParams();
  const phaseFromUrl = searchParams.get('phase');
  const [selectedPhase, setSelectedPhase] = useState(phaseFromUrl || designPhases[0].id);
  const {
    loading
  } = useDatabaseDebug();

  // For debugging
  useEffect(() => {
    console.log("Design phases loaded:", designPhases.map(phase => phase.id));
    console.log("Selected phase:", selectedPhase);
    console.log("Phase from URL:", phaseFromUrl);
  }, [phaseFromUrl, selectedPhase]);

  // Update selectedPhase when URL parameter changes
  useEffect(() => {
    if (phaseFromUrl && designPhases.some(phase => phase.id === phaseFromUrl)) {
      setSelectedPhase(phaseFromUrl);
    }
  }, [phaseFromUrl]);

  // Update URL when selectedPhase changes
  useEffect(() => {
    if (selectedPhase) {
      navigate(`/design?phase=${selectedPhase}`, {
        replace: true
      });
    }
  }, [selectedPhase, navigate]);

  // Redirect to projects page if no active project
  useEffect(() => {
    if (!activeProject) {
      navigate("/projects");
    }
  }, [activeProject, navigate]);
  
  if (!activeProject) {
    return <PageLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">No Project Selected</h1>
          <p className="mb-4">Please select a project to continue with the design process.</p>
          <Button onClick={() => navigate("/projects")}>
            Go to Projects
          </Button>
        </div>
      </PageLayout>;
  }
  
  return <PageLayout>
      <div className="p-8">
        <DesignHero />
        
        <Card className="mb-6 border-opacity-50 shadow-md">
          <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary">
                Current Project: <span className="text-primary">{activeProject.name}</span>
              </h2>
              
              <RefreshProjectContextButton />
            </div>
          </CardHeader>
          <CardContent className="bg-white pb-0">
            {activeProject.description && <p className="text-gray-600 mt-1 my-[15px]">{activeProject.description}</p>}
          </CardContent>
        </Card>
        
        <DesignAssistant />

        <PhaseProgress phases={designPhases.map(phase => ({
          id: phase.id,
          title: phase.title
        }))} currentPhase={selectedPhase} onSelectPhase={setSelectedPhase} />

        <Tabs defaultValue={designPhases[0].id} value={selectedPhase} onValueChange={setSelectedPhase} className="mb-16">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            {designPhases.map(phase => <TabsTrigger key={phase.id} value={phase.id} className="flex items-center gap-2 py-3">
                {phase.icon}
                <span>{phase.title}</span>
              </TabsTrigger>)}
          </TabsList>
          
          {designPhases.map(phase => <TabsContent key={phase.id} value={phase.id} className="space-y-8">
              <PhaseHeader title={phase.title} description={phase.description} tooltipKey={phase.id === "context" ? "design-context-phase" : phase.id === "define" ? "design-define-phase" : undefined} />
              <DesignPhaseCard phaseId={phase.id} steps={phase.steps} />
            </TabsContent>)}
        </Tabs>
      </div>
    </PageLayout>;
};

export default Design;
