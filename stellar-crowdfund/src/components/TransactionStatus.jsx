import { useEffect } from 'react';

export default function TransactionStatus({ txHash, error, onClose }) {
  useEffect(() => {
    if (!txHash && !error) return;
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [txHash, error, onClose]);

  if (!txHash && !error) return null;

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg border max-w-sm ${txHash ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          {txHash ? (
            <>
              <p className="font-semibold text-green-800">İşlem Başarılı!</p>
              <p className="text-xs text-green-600 font-mono break-all mt-1">Tx: {txHash}</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-red-800">İşlem Başarısız</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </>
          )}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
      </div>
    </div>
  );
}
