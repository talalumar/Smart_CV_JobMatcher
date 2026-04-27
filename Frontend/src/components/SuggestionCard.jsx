export default function SuggestionCard() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        Resume Suggestions
      </h2>

      <ul className="list-disc pl-6">
        <li>Add GitHub profile</li>
        <li>Improve project descriptions</li>
        <li>Add measurable achievements</li>
      </ul>
    </div>
  );
}