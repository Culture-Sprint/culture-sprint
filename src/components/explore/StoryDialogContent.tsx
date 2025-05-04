
interface StoryContentProps {
  text: string;
  feeling: string;
}

const StoryContent = ({ text, feeling }: StoryContentProps) => {
  return (
    <>
      <div>
        <h3 className="text-lg font-semibold mb-2">Story</h3>
        <p className="whitespace-pre-line">{text}</p>
      </div>
      
      {feeling && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Emotional Response</h3>
          <p>{feeling}</p>
        </div>
      )}
    </>
  );
};

export default StoryContent;
