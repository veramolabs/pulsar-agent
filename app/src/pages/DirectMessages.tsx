import React from "react";
import { Typography, Layout, Button, Row, Col, Card } from "antd";
import Page from "../layout/Page";
import Stream from "../components/Stream";
import CloudConnect from "../components/CloudConnect";
import { useVeramo } from "@veramo-community/veramo-react";
import DMSetup from "../components/DMSetup";

const { Title } = Typography;

const DirectMessages = () => {
  const { getAgent, removeAgent } = useVeramo();
  let agent;
  try {
    agent = getAgent("privateAgent");
  } catch (e) {}

  return (
    <Page
      header={
        <Row>
          <Col flex={1}>
            <Title level={4} style={{ fontWeight: "bold" }}>
              Direct messages
            </Title>
          </Col>
        </Row>
      }
    >
      <DMSetup />
      <CloudConnect />

      {agent && <Stream agent={agent} privateMode />}
    </Page>
  );
};

export default DirectMessages;
