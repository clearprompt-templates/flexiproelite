import { AlertCircle } from 'lucide-react';

interface ErrorFallbackProps {
  error: string;
}

export function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <AlertCircle size={32} className="text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Configuration Error
        </h1>

        <p className="text-gray-600 mb-4">
          Unable to load the site configuration. Please ensure the config.json file is
          properly configured and accessible.
        </p>

        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-600 font-mono">{error}</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
