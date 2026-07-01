import { useState } from 'react';
import { sendXLM } from '../lib/stellar';
import { CAMPAIGN_ADDRESS } from '../config';

export default function DonateForm({ address, balance, onSuccess, onError }) {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return onError('Geçerli bir miktar girin');
    if (numAmount > parseFloat(balance)) return onError('Yetersiz bakiye');

    setSending(true);
    try {
      const result = await sendXLM(address, CAMPAIGN_ADDRESS, numAmount, memo);
      onSuccess(result.hash);
      setAmount('');
      setMemo('');
    } catch (err) {
      onError(err.message || 'İşlem başarısız');
    } finally {
      setSending(false);
    }
  };

  if (!address) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border text-center text-gray-500">
        Bağış yapmak için cüzdanınızı bağlayın
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
      <h3 className="text-lg font-semibold">Bağış Yap</h3>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Miktar (XLM)</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={sending}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Mesaj (opsiyonel)</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Bir not bırakın..."
          maxLength={28}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={sending}
        />
      </div>

      <button
        type="submit"
        disabled={sending || !amount}
        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium"
      >
        {sending ? 'Gönderiliyor...' : 'Bağış Yap'}
      </button>
    </form>
  );
}
