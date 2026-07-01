import { useState } from 'react';

export default function WalletConnect({ address, isAvailable, onConnect, onDisconnect }) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      await onConnect();
    } catch (err) {
      setError(err.message);
    } finally {
      setConnecting(false);
    }
  };

  if (!isAvailable) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
        Freighter wallet tarayıcı eklentisi bulunamadı.{' '}
        <a href="https://freighter.app" className="underline" target="_blank" rel="noopener noreferrer">
          Freighter'ı yükleyin
        </a>
      </div>
    );
  }

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono text-gray-600">
          {address.slice(0, 4)}...{address.slice(-4)}
        </span>
        <button
          onClick={onDisconnect}
          className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition"
        >
          Çıkış Yap
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={connecting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {connecting ? 'Bağlanıyor...' : 'Cüzdanı Bağla'}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
