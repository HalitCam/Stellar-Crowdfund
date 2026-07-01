import { useState, useEffect } from 'react';
import { getCampaignBalance } from '../lib/stellar';
import { CAMPAIGN_ADDRESS, GOAL_XLM } from '../config';

export default function CampaignCard() {
  const [raised, setRaised] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const bal = await getCampaignBalance(CAMPAIGN_ADDRESS);
        if (!cancelled) setRaised(bal);
      } catch {
        if (!cancelled) setError('Kampanya bilgisi alınamadı');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    const interval = setInterval(fetch, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const percent = raised ? Math.min((parseFloat(raised) / GOAL_XLM) * 100, 100) : 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-bold mb-1">Community Crowdfund</h2>
      <p className="text-sm text-gray-500 mb-4">
        Hedef: {GOAL_XLM} XLM · Kampanya: {CAMPAIGN_ADDRESS.slice(0, 4)}...{CAMPAIGN_ADDRESS.slice(-4)}
      </p>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {loading && <p className="text-sm text-gray-400">Yükleniyor...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && raised !== null && (
        <div className="flex justify-between text-sm">
          <span className="font-semibold">{parseFloat(raised).toFixed(2)} XLM toplandı</span>
          <span className="text-gray-500">%{percent.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
}
