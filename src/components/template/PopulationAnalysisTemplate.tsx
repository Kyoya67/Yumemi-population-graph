interface PopulationAnalysisTemplateProps {
    children: React.ReactNode;
}

export const PopulationAnalysisTemplate = ({ children }: PopulationAnalysisTemplateProps) => (
    <div className="container mx-auto p-4">
        {children}
    </div>
);