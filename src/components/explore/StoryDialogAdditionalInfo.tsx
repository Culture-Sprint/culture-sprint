
interface AdditionalInfoSectionProps {
  additionalComments?: string;
  name?: string;
}

const AdditionalInfoSection = ({ additionalComments, name }: AdditionalInfoSectionProps) => {
  if (!additionalComments && !name) return null;
  
  return (
    <>
      {additionalComments && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Additional Comments</h3>
          <p className="whitespace-pre-line">{additionalComments}</p>
        </div>
      )}
      
      {name && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Shared by</h3>
          <p>{name}</p>
        </div>
      )}
    </>
  );
};

export default AdditionalInfoSection;
