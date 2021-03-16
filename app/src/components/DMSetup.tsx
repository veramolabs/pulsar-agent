import React, { useEffect, useState } from "react";
import {
  Typography,
  Form,
  Input,
  Button,
  List,
  notification,
  Card,
  Row,
  Col,
} from "antd";
import { useVeramo } from "@veramo-community/veramo-react";
import { IDIDManager, IResolver, TAgent } from "@veramo/core";

interface FormValues {
  endpoint: string;
}

const DMSetup = () => {
  const [endpoint, setEndpoint] = useState<string>();
  const [messagingEndpoint, setMessagingEndpoint] = useState<
    string | undefined
  >(undefined);
  const [owner, setOwner] = useState<string | undefined>(undefined);

  const { getAgent } = useVeramo();

  let agent: TAgent<IDIDManager & IResolver> | undefined;

  try {
    agent = getAgent("web3Agent");
  } catch (e) {}

  useEffect(() => {
    if (agent) {
      agent
        .didManagerGetByAlias({ alias: "owner" })
        .then((owner) => {
          setOwner(owner.did);
          return owner;
        })
        .then(({ did }) => agent?.resolveDid({ didUrl: did }))
        .then((didDoc) => {
          const service = didDoc?.service?.find((s) => s.type === "Messaging");
          if (service) {
            setMessagingEndpoint(service.serviceEndpoint);
          }
        });
    }
  }, [agent]);

  const addService = async () => {
    try {
      if (owner && endpoint) {
        await agent?.didManagerAddService({
          did: owner,
          service: {
            id: "msg123",
            type: "Messaging",
            serviceEndpoint: endpoint,
            description: "",
          },
        });
        notification.success({ message: "Direct messages enabled" });
      }
    } catch (error) {
      notification.error({ message: "Failed" });
    }
  };

  if (messagingEndpoint) {
    return <Card>Your messages are handled by: {messagingEndpoint}</Card>;
  }

  return (
    <Card title="Enable direct messages" bordered={false}>
      <Typography.Text>
        Update your DID dcouments service endpoint to enable direct messaging.
      </Typography.Text>
      <Row style={{ alignItems: "center", marginTop: 15 }}>
        <Col flex={1} style={{ marginRight: 20 }}>
          <Input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="Messaging URL"
            style={{
              padding: 10,
              fontSize: 16,
              borderRadius: 10,
            }}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            disabled={!endpoint}
            onClick={addService}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default DMSetup;
