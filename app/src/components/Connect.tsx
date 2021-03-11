import React from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import { Web3Provider } from "@ethersproject/providers";

import { injected, walletconnect } from "../web3/connectors";
import { Typography, Card, Layout, Button, Row, Col } from "antd";
const { Title, Text } = Typography;

enum ConnectorNames {
  Injected = "Metamask",
  WalletConnect = "WalletConnect",
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
};

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

export default function Connect() {
  const context = useWeb3React<Web3Provider>();
  const { connector, activate, deactivate, active, error } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();

  const currentConnector = connectorsByName["Metamask"];
  const activating = currentConnector === activatingConnector;
  const connected = currentConnector === connector;
  const disabled = !!activatingConnector || connected || !!error;

  //   React.useEffect(() => {
  //     if (activatingConnector && activatingConnector === connector) {
  //       setActivatingConnector(undefined);
  //     }
  //   }, [activatingConnector, connector]);

  return connected ? (
    <Card>
      <Title level={3}>Logged In</Title>
      <Text>Welcome!</Text>
      <div style={{ marginTop: 20 }}>
        <Button
          type="primary"
          size="large"
          shape="round"
          style={{ width: "100%" }}
          onClick={() => deactivate()}
        >
          Disconnect
        </Button>
      </div>
    </Card>
  ) : (
    <Card>
      <Title level={3}>Login with Metamask</Title>
      <Text>Post as a DID or NFT!</Text>
      <div style={{ marginTop: 20 }}>
        <Button
          type="primary"
          size="large"
          shape="round"
          style={{ width: "100%" }}
          onClick={() => activate(connectorsByName["Metamask"])}
        >
          Connect
        </Button>
      </div>
    </Card>
  );
}