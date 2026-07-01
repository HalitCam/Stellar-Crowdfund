import { useState, useEffect } from 'react';
import { getBalance } from '../lib/stellar';

export default function WalletBalance({ address }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) {
      setBalance(null);
      return;
    }

    let cancelled = false;
    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        const bal = await getBalance(address);
        if (!cancelled) setBalance(bal);
      } catch {
        if (!cancelled) setError('Bakiye alınamadı');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBalance();
    return () => { cancelled = true; };
  }, [address]);

  if (!address) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <p className="text-sm text-gray-500">Cüzdan Bakiyesi</p>
      {loading && <p className="text-gray-400 text-sm">Yükleniyor...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!loading && !error && balance !== null && (
        <p className="text-2xl font-bold">{parseFloat(balance).toFixed(2)} XLM</p>
      )}
    </div>
  );
}
