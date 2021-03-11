import React from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector'
import { Web3Provider } from '@ethersproject/providers'
// import { formatEther } from '@ethersproject/units'

import {
  injected,
  // network,
  walletconnect,
  // walletlink,
  // ledger,
  // trezor,
  // lattice,
  // frame,
  // authereum,
  // fortmatic,
  // magic,
  // portis,
  // torus
} from './connectors'
import { Button } from 'antd'


enum ConnectorNames {
  Injected = 'Metamask',
  // Network = 'Network',
  WalletConnect = 'WalletConnect',
  // WalletLink = 'WalletLink',
  // Ledger = 'Ledger',
  // Trezor = 'Trezor',
  // Lattice = 'Lattice',
  // Frame = 'Frame',
  // Authereum = 'Authereum',
  // Fortmatic = 'Fortmatic',
  // Magic = 'Magic',
  // Portis = 'Portis',
  // Torus = 'Torus'
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  // [ConnectorNames.Network]: network,
  [ConnectorNames.WalletConnect]: walletconnect,
  // [ConnectorNames.WalletLink]: walletlink,
  // [ConnectorNames.Ledger]: ledger,
  // [ConnectorNames.Trezor]: trezor,
  // [ConnectorNames.Lattice]: lattice,
  // [ConnectorNames.Frame]: frame,
  // [ConnectorNames.Authereum]: authereum,
  // [ConnectorNames.Fortmatic]: fortmatic,
  // [ConnectorNames.Magic]: magic,
  // [ConnectorNames.Portis]: portis,
  // [ConnectorNames.Torus]: torus
}

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}



// function ChainId() {
//   const { chainId } = useWeb3React()

//   return (
//     <>
//       <span>Chain Id</span>
//       <span role="img" aria-label="chain">
//         ⛓
//       </span>
//       <span>{chainId ?? ''}</span>
//     </>
//   )
// }

// function BlockNumber() {
//   const { chainId, library } = useWeb3React()

//   const [blockNumber, setBlockNumber] = React.useState<number>()
//   React.useEffect((): any => {
//     if (!!library) {
//       let stale = false

//       library
//         .getBlockNumber()
//         .then((blockNumber: number) => {
//           if (!stale) {
//             setBlockNumber(blockNumber)
//           }
//         })
//         .catch(() => {
//           if (!stale) {
//             setBlockNumber(undefined)
//           }
//         })

//       const updateBlockNumber = (blockNumber: number) => {
//         setBlockNumber(blockNumber)
//       }
//       library.on('block', updateBlockNumber)

//       return () => {
//         stale = true
//         library.removeListener('block', updateBlockNumber)
//         setBlockNumber(undefined)
//       }
//     }
//   }, [library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

//   return (
//     <>
//       <span>Block Number</span>
//       <span role="img" aria-label="numbers">
//         🔢
//       </span>
//       <span>{blockNumber === null ? 'Error' : blockNumber ?? ''}</span>
//     </>
//   )
// }

// function Account() {
//   const { account } = useWeb3React()

//   return (
//     <>
//       <span>Account</span>
//       <span role="img" aria-label="robot">
//         🤖
//       </span>
//       <span>
//         {account === null
//           ? '-'
//           : account
//             ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
//             : ''}
//       </span>
//     </>
//   )
// }

// function Balance() {
//   const { account, library, chainId } = useWeb3React()

//   const [balance, setBalance] = React.useState()
//   React.useEffect((): any => {
//     if (!!account && !!library) {
//       let stale = false

//       library
//         .getBalance(account)
//         .then((balance: any) => {
//           if (!stale) {
//             setBalance(balance)
//           }
//         })
//         .catch(() => {
//           if (!stale) {
//             setBalance(undefined)
//           }
//         })

//       return () => {
//         stale = true
//         setBalance(undefined)
//       }
//     }
//   }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

//   return (
//     <>
//       <span>Balance</span>
//       <span role="img" aria-label="gold">
//         💰
//       </span>
//       <span>{balance === null ? 'Error' : balance ? `Ξ${formatEther(balance as any)}` : ''}</span>
//     </>
//   )
// }

// function Header() {
//   const { active, error } = useWeb3React()

//   return (
//     <>
//       <h1 style={{ margin: '1rem', textAlign: 'right' }}>{active ? '🟢' : error ? '🔴' : '🟠'}</h1>
//       <h3
//         style={{
//           display: 'grid',
//           gridGap: '1rem',
//           gridTemplateColumns: '1fr min-content 1fr',
//           maxWidth: '20rem',
//           lineHeight: '2rem',
//           margin: 'auto'
//         }}
//       >
//         <ChainId />
//         <BlockNumber />
//         <Account />
//         <Balance />
//       </h3>
//     </>
//   )
// }

export function Web3() {
  const context = useWeb3React<Web3Provider>()
  const { connector,
    // library,
    // chainId, 
    // account,
     activate, deactivate, active, error } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])


  return (
    <>
      {/* <Header /> */}
      <hr style={{ margin: '2rem' }} />
      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '20rem',
          margin: 'auto'
        }}
      >
        {Object.keys(connectorsByName).map(name => {
          //@ts-ignore
          const currentConnector = connectorsByName[name]
          const activating = currentConnector === activatingConnector
          const connected = currentConnector === connector
          const disabled = !!activatingConnector || connected || !!error

          return (
            <Button
              style={{
                borderColor: activating ? 'orange' : connected ? 'green' : 'unset',
                cursor: disabled ? 'unset' : 'pointer',
              }}
              disabled={disabled}
              key={name}
              onClick={() => {
                setActivatingConnector(currentConnector)
                //@ts-ignore
                activate(connectorsByName[name])
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'black',
                  margin: '0 0 0 1rem'
                }}
              >
                {activating && <span role="img" aria-label="check">
                  loading...
                  </span>}
                {connected && (
                  <span role="img" aria-label="check">
                    ✅
                  </span>
                )}
              </div>
              {name}
            </Button>
          )
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {(active || error) && (
          <Button
            type='ghost'
            onClick={() => {
              deactivate()
            }}
          >
            Deactivate
          </Button>
        )}

        {!!error && <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>{getErrorMessage(error)}</h4>}
      </div>

      <hr style={{ margin: '2rem' }} />

      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: 'fit-content',
          maxWidth: '20rem',
          margin: 'auto'
        }}
      >

        {connector === connectorsByName[ConnectorNames.WalletConnect] && (
          <Button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ; (connector as any).close()
            }}
          >
            Kill WalletConnect Session
          </Button>
        )}

        {/* {!!(connector === connectorsByName[ConnectorNames.Network] && chainId) && (
          <Button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;(connector as any).changeChainId(chainId === 1 ? 4 : 1)
            }}
          >
            Switch Networks
          </Button>
        )}
        
        {connector === connectorsByName[ConnectorNames.WalletLink] && (
          <Button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;(connector as any).close()
            }}
          >
            Kill WalletLink Session
          </Button>
        )}
        {connector === connectorsByName[ConnectorNames.Fortmatic] && (
          <Button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;(connector as any).close()
            }}
          >
            Kill Fortmatic Session
          </Button>
        )}
        {connector === connectorsByName[ConnectorNames.Magic] && (
          <Button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;(connector as any).close()
            }}
          >
            Kill Magic Session
          </Button>
        )}
        {connector === connectorsByName[ConnectorNames.Portis] && (
          <>
            {chainId !== undefined && (
              <Button
                style={{
                  height: '3rem',
                  borderRadius: '1rem',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  ;(connector as any).changeNetwork(chainId === 1 ? 100 : 1)
                }}
              >
                Switch Networks
              </Button>
            )}
            <Button
              style={{
                height: '3rem',
                borderRadius: '1rem',
                cursor: 'pointer'
              }}
              onClick={() => {
                ;(connector as any).close()
              }}
            >
              Kill Portis Session
            </Button>
          </>
        )}
        {connector === connectorsByName[ConnectorNames.Torus] && (
          <Button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;(connector as any).close()
            }}
          >
            Kill Torus Session
          </Button>
        )} */}
      </div>
    </>
  )
}
