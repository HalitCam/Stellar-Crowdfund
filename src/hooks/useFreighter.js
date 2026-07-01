import { useState, useEffect, useCallback } from 'react';

export function useFreighter() {
  const [address, setAddress] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    setIsAvailable(typeof window.freighter !== 'undefined');
  }, []);

  const connect = useCallback(async () => {
    try {
      const { address: pubKey } = await window.freighter.connect();
      setAddress(pubKey);
      return pubKey;
    } catch (err) {
      throw new Error('Cüzdan bağlantısı reddedildi.');
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return { address, isAvailable, connect, disconnect };
}
