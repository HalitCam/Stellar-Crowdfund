import { useState, useEffect } from 'react';
import { getRecentPayments } from '../lib/stellar';
import { CAMPAIGN_ADDRESS } from '../config';

export default function DonorList({ refreshTrigger }) {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const payments = await getRecentPayments(CAMPAIGN_ADDRESS);
        if (!cancelled) setDonors(payments);
      } catch {
        if (!cancelled) setError('Bağışçı listesi alınamadı');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
  }, [refreshTrigger]);

  if (loading) return <p className="text-sm text-gray-400">Yükleniyor...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (donors.length === 0) return <p className="text-sm text-gray-400">Henüz bağış yapılmamış</p>;

  return (
    <div className="space-y-2">
      {donors.map((d, i) => (
        <div key={d.txHash || i} className="flex justify-between items-center py-2 border-b last:border-b-0 text-sm">
          <div>
            <span className="font-mono text-gray-600">{d.from.slice(0, 4)}...{d.from.slice(-4)}</span>
            {d.memo && <span className="ml-2 text-gray-400 italic">— {d.memo}</span>}
          </div>
          <span className="font-semibold">{parseFloat(d.amount).toFixed(2)} XLM</span>
        </div>
      ))}
    </div>
  );
}
