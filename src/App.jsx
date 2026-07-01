import { useState, useCallback } from 'react';
import { useFreighter } from './hooks/useFreighter';
import { getBalance } from './lib/stellar';
import WalletConnect from './components/WalletConnect';
import WalletBalance from './components/WalletBalance';
import CampaignCard from './components/CampaignCard';
import DonateForm from './components/DonateForm';
import DonorList from './components/DonorList';
import TransactionStatus from './components/TransactionStatus';

export default function App() {
  const { address, isAvailable, connect, disconnect } = useFreighter();
  const [balance, setBalance] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txError, setTxError] = useState(null);
  const [refreshDonors, setRefreshDonors] = useState(0);

  const handleConnect = useCallback(async () => {
    const pubKey = await connect();
    if (pubKey) {
      const bal = await getBalance(pubKey);
      setBalance(bal);
    }
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setBalance(null);
  }, [disconnect]);

  const handleSuccess = useCallback((hash) => {
    setTxHash(hash);
    setTxError(null);
    setRefreshDonors((n) => n + 1);
    if (address) {
      getBalance(address).then(setBalance);
    }
  }, [address]);

  const handleError = useCallback((msg) => {
    setTxError(msg);
    setTxHash(null);
  }, []);

  const handleCloseTx = useCallback(() => {
    setTxHash(null);
    setTxError(null);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stellar Crowdfund</h1>
        <WalletConnect
          address={address}
          isAvailable={isAvailable}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </header>

      <WalletBalance address={address} />

      <CampaignCard />

      <DonateForm
        address={address}
        balance={balance}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-3">Bağışçılar</h3>
        <DonorList refreshTrigger={refreshDonors} />
      </div>

      <TransactionStatus
        txHash={txHash}
        error={txError}
        onClose={handleCloseTx}
      />
    </div>
  );
}
