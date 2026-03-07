import { getStubHistory, HistoryRecord } from './PatientHistory'

type MedHistoryProps = {
    patientID: string
}

export default function MedHistory({ patientID }: MedHistoryProps) {
    const history: HistoryRecord[] = getStubHistory(patientID)

    // Optional: sort by newest first
    const sortedHistory = [...history].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-6">
                Medical History
            </h2>

            <div className="relative border-l-2 border-gray-200 ml-4">
                {sortedHistory.map((record) => (
                    <div key={record.id} className="mb-10 ml-6 relative">

                        {/* Timeline Dot */}
                        <span
                            className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-8 ring-white
                            ${record.type === 'DIAGNOSIS'
                                ? 'bg-red-500'
                                : 'bg-blue-500'}`}
                        />

                        {/* Card */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition">
                            <div className="flex justify-between items-center mb-2">
                                <h3
                                    className={`font-semibold text-lg
                                    ${record.type === 'DIAGNOSIS'
                                        ? 'text-red-700'
                                        : 'text-blue-700'}`}
                                >
                                    {record.title}
                                </h3>

                                <span className="text-sm text-gray-500">
                                    {record.date}
                                </span>
                            </div>

                            <p className="text-gray-700 mb-2">
                                {record.details}
                            </p>

                            {record.notes && (
                                <p className="text-sm text-gray-500 italic">
                                    {record.notes}
                                </p>
                            )}

                            <div className="mt-2">
                                <span
                                    className={`inline-block text-xs font-medium px-2 py-1 rounded-full
                                    ${record.type === 'DIAGNOSIS'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-700'}`}
                                >
                                    {record.type}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {history.length === 0 && (
                    <p className="text-gray-500 italic ml-6">
                        No medical history records found.
                    </p>
                )}
            </div>
        </div>
    )
}