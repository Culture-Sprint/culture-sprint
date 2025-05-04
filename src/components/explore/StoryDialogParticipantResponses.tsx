
interface ParticipantResponse {
  id: string;
  question_id: string;
  question_text: string;
  response: string;
}

interface ParticipantResponsesSectionProps {
  participantResponses: ParticipantResponse[];
}

const ParticipantResponsesSection = ({ participantResponses }: ParticipantResponsesSectionProps) => {
  if (participantResponses.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">About the Contributor</h3>
      <div className="space-y-3">
        {participantResponses.map((response) => (
          <div key={response.id} className="border-b pb-3">
            <p className="font-medium">{response.question_text}</p>
            <p className="text-gray-700">{response.response}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantResponsesSection;
