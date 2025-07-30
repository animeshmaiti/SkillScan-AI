import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { usePuterStore } from '~/lib/puter';

const WipeApp = () => {
  const [statusText, setStatusText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    setStatusText('Loading files...');
    const files = (await fs.readDir('./')) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate('/auth?next=/wipe');
    }
  }, [isLoading]);

  const handleDelete = async () => {
    setIsProcessing(true);
    setStatusText('Wiping app data...');
    files.forEach(async (file) => {
      await fs.delete(file.path);
    });
    await kv.flush();
    loadFiles();
    setStatusText('App data wiped successfully!');
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="text-lg font-semibold text-gray-500">Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="text-red-600 font-semibold text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-xl p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Wipe App Data
          </h1>
          <p className="text-sm text-gray-500">
            Authenticated as:
            <span className="ml-2 font-semibold text-gray-700">
              {auth.user?.username || 'Unknown'}
            </span>
          </p>
        </div>

        {isProcessing ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg shadow bg-blue-50 text-blue-700 border border-blue-200 font-medium">
            {statusText}
          </div>
        ) : (
          <div>
            <h2 className="font-semibold text-lg text-gray-700 mb-1">
              Existing Files:
            </h2>
            <div className="flex flex-col gap-3">
              {files.length > 0 ? (
                files.map((file) => (
                  <div
                    key={file.id}
                    className="px-4 py-2 bg-gray-50 rounded flex items-center border border-gray-200"
                  >
                    <span className="flex-1 text-gray-800 font-medium">
                      {file.name}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic text-sm">
                  No files found.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            className="primary-gradient hover:primary-gradient-hover text-white px-6 py-2 rounded-lg font-bold shadow transition-all duration-150 active:scale-95"
            onClick={handleDelete}
          >
            Wipe App Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default WipeApp;
