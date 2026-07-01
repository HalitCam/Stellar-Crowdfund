import {
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  BASE_FEE,
} from '@stellar/stellar-sdk';
import { HORIZON_URL, NETWORK_PASSPHRASE } from '../config';

const server = new Horizon.Server(HORIZON_URL);

export async function getBalance(publicKey) {
  const account = await server.loadAccount(publicKey);
  const xlmBalance = account.balances.find((b) => b.asset_type === 'native');
  return xlmBalance ? xlmBalance.balance : '0';
}

export async function getCampaignBalance(campaignAddress) {
  return getBalance(campaignAddress);
}

export async function sendXLM(sourcePublicKey, destination, amountXlm, memoText = '') {
  const account = await server.loadAccount(sourcePublicKey);
  const fee = await server.fetchBaseFee();

  const transaction = new TransactionBuilder(account, {
    fee: String(fee),
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount: amountXlm.toString(),
      })
    );

  if (memoText) {
    const { Memo } = await import('@stellar/stellar-sdk');
    transaction.addMemo(Memo.text(memoText));
  }

  const built = transaction.setTimeout(30).build();

  const { signature } = await window.freighter.signTransaction(
    built.toXDR(),
    { networkPassphrase: NETWORK_PASSPHRASE }
  );

  const envelope = TransactionBuilder.fromXDR(signature, NETWORK_PASSPHRASE);
  const result = await server.submitTransaction(envelope);

  return { hash: result.hash };
}

export async function getRecentPayments(address, limit = 10) {
  const payments = await server
    .payments()
    .forAccount(address)
    .order('desc')
    .limit(limit)
    .call();

  return payments.records
    .filter((p) => p.type === 'payment')
    .map((p) => ({
      from: p.from,
      to: p.to,
      amount: p.amount,
      assetType: p.asset_type,
      memo: p.memo || '',
      createdAt: p.created_at,
      txHash: p.transaction_hash,
    }));
}
