// Import required dependencies
import { useState } from 'react';
import { Eye } from 'lucide-react';

// Define interfaces for type safety
interface Organization {
  id: number;
  organization_name: string;
  email: string;
  metadata: Record<string, any>;
}

interface ResultsPanelProps {
  results: Organization[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: Record<string, any>;
  organizationName: string;  // Added to show context in modal
}

// MetadataValue component to handle different types of metadata values
const MetadataValue = ({ value }: { value: any }) => {
  // Handle different types of values appropriately
  if (Array.isArray(value)) {
    return (
      <div className="space-y-1">
        {value.map((item, index) => (
          <div key={index} className="text-sm">
            • {JSON.stringify(item)}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div className="text-sm whitespace-pre-wrap">
        {JSON.stringify(value, null, 2)}
      </div>
    );
  }

  return <div className="text-sm">{String(value)}</div>;
};

// Modal component for displaying metadata
const MetadataModal = ({ isOpen, onClose, metadata, organizationName }: ModalProps) => {
  // Don't render anything if modal is not open
  if (!isOpen) return null;

  // Function to copy metadata to clipboard
  const copyToClipboard = (key: string, value: any) => {
    navigator.clipboard.writeText(JSON.stringify(value));
  };

  return (
    // Modal overlay - covers entire screen with semi-transparent background
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal content container */}
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Organization Metadata</h3>
            <p className="text-sm text-gray-600">{organizationName}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Metadata content */}
        <div className="space-y-6">
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex justify-between items-start mb-2">
                {/* Metadata key */}
                <div className="font-medium text-gray-700 capitalize">
                  {key.replace(/_/g, ' ')}
                </div>
                {/* Copy button */}
                <button
                  onClick={() => copyToClipboard(key, value)}
                  className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 hover:bg-blue-50 rounded"
                >
                  Copy
                </button>
              </div>
              {/* Metadata value with custom rendering */}
              <MetadataValue value={value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main ResultsPanel component
export default function ResultsPanel({ results }: ResultsPanelProps) {
  // State to track which metadata is selected to show in modal
  const [selectedMetadata, setSelectedMetadata] = useState<{
    metadata: Record<string, any>;
    organizationName: string;
  } | null>(null);

  return (
    <div className="w-3/4 p-4">
      <h2 className="font-bold mb-4">Search Results</h2>
      {results.length > 0 ? (
        <>
          {/* Results table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization Name
                  </th>
                  <th className="px-4 py-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="w-20 px-4 py-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border">{result.organization_name}</td>
                    <td className="px-4 py-3 border">{result.email}</td>
                    <td className="px-4 py-3 border">
                      <button
                        onClick={() => setSelectedMetadata({
                          metadata: result.metadata,
                          organizationName: result.organization_name
                        })}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="View Metadata"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Metadata Modal */}
          <MetadataModal 
            isOpen={!!selectedMetadata}
            onClose={() => setSelectedMetadata(null)}
            metadata={selectedMetadata?.metadata || {}}
            organizationName={selectedMetadata?.organizationName || ''}
          />
        </>
      ) : (
        <p className="text-gray-500 text-center py-8">No results found.</p>
      )}
    </div>
  );
}