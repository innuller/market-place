// components/ResultsPanel.tsx
'use client'

interface Organization {
  id: number
  organization_name: string
  email: string
  metadata: Record<string, any>
}

interface ResultsPanelProps {
  results: Organization[]
}

export default function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div className="w-3/4 p-4">
      <h2 className="font-bold mb-4">Search Results</h2>
      {results.length > 0 ? (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Organization Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td className="px-4 py-2 border">{result.organization_name}</td>
                <td className="px-4 py-2 border">{result.email}</td>
                <td className="px-4 py-2 border">
                  <pre>{JSON.stringify(result.metadata, null, 2)}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  )
}
