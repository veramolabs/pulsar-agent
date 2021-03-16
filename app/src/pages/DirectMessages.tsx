import React from "react";
import { Typography, Layout, Button } from "antd";
import Page from "../layout/Page";
import Stream from "../components/Stream";
import CloudConnect from "../components/CloudConnect";
import { useVeramo } from "@veramo-community/veramo-react";
import DMSetup from "../components/DMSetup";

const { Title } = Typography;

const DirectMessages = () => {

  const { getAgent, removeAgent } = useVeramo()
  let agent
  try {
    agent = getAgent("privateAgent");
  } catch (e) {}

  return (
    <Page
      header={
        <Title level={4} style={{ fontWeight: "bold" }}>
          Direct messages
        </Title>
      }
    >
      <DMSetup />
      {!agent && <CloudConnect />}
      {agent && <Button onClick={() => removeAgent('privateAgent')}>Disconnect</Button>}
      {agent && <Stream agent={agent} />}
    </Page>
  );
};

export default DirectMessages;
