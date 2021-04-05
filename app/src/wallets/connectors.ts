import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const POLLING_INTERVAL = 12000

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: 'https://mainnet.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})
