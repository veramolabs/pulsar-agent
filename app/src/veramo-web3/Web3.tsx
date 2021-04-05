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

import { injected, walletconnect } from '../wallets/connectors'
import { Button } from 'antd'


enum ConnectorNames {
  Injected = 'Metamask',
  WalletConnect = 'WalletConnect'
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect
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

export function Web3() {
  const context = useWeb3React<Web3Provider>()
  const { connector, activate, deactivate, active, error } = context

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
