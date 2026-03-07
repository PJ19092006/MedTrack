export type RecordType = "DIAGNOSIS" | "PRESCRIPTION";

export type HistoryRecord = {
  id: string;
  date: string;
  type: RecordType;
  title: string;
  details: string;
  notes?: string;
};

// Temporary stub data - separated by event type
export const getStubHistory = (patientID: string): HistoryRecord[] => {
  return [
    {
      id: "1",
      date: "2024-02-15",
      type: "PRESCRIPTION",
      title: "Lisinopril 10mg",
      details: "Take 1 tablet daily",
      notes: "Prescribed to manage rising blood pressure.",
    },
    {
      id: "2",
      date: "2024-02-15",
      type: "DIAGNOSIS",
      title: "Hypertension Stage 1",
      details: "Diagnosed based on 3 consecutive elevated readings.",
      notes: "Patient reported occasional headaches.",
    },
    {
      id: "3",
      date: "2023-11-10",
      type: "PRESCRIPTION",
      title: "Metformin 500mg",
      details: "Take twice daily with meals",
      notes: "Adjusted dosage after 1 month review.",
    },
    {
      id: "4",
      date: "2023-10-05",
      type: "DIAGNOSIS",
      title: "Type 2 Diabetes",
      details: "HbA1c levels at 7.2%",
      notes: "Initial diagnosis. Diet and exercise plan discussed.",
    },
    {
      id: "5",
      date: "2023-01-20",
      type: "DIAGNOSIS",
      title: "Acute Bronchitis",
      details: "Patient presented with severe cough and slight fever.",
    },
    {
      id: "6",
      date: "2023-01-20",
      type: "PRESCRIPTION",
      title: "Azithromycin 250mg",
      details: "5-day course",
    },
  ];
};

export default function PatientHistory({
  history,
  patientID,
}: {
  history: HistoryRecord[];
  patientID: string;
}) {
  // const history = getStubHistory(patientID);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Patient History (ID: {patientID})
      </h2>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider"
              >
                Details
              </th>
              <th
                scope="col"
                className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider"
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {record.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                        ${record.type === "DIAGNOSIS" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}
                  >
                    {record.type}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 font-semibold ${record.type === "DIAGNOSIS" ? "text-red-700" : "text-blue-700"}`}
                >
                  {record.title}
                </td>
                <td className="px-6 py-4 text-gray-900 border-x border-gray-100 min-w-[200px]">
                  {record.details}
                </td>
                <td className="px-6 py-4 text-gray-600 italic min-w-[200px]">
                  {record.notes || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {history.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500 italic bg-white">
            No history records found for this patient.
          </div>
        )}
      </div>
    </div>
  );
}
