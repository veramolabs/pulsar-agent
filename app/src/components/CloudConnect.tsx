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
import { useQuery } from "react-query";

const CloudConnect = () => {
  const { addAgentConfig } = useVeramo();
  const [name, setName] = useState<string>();
  const [schemaUrl, setSchemaUrl] = useState<string>();
  const [agentUrl, setAgentUrl] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>();
  const [jsonError, setJsonError] = useState(false);

  const { getAgent, removeAgent } = useVeramo();
  let agent;
  try {
    agent = getAgent("privateAgent");
  } catch (e) {}

  const newAgentConfig = () => {
    addAgentConfig({
      context: { name, id: "privateAgent", schema: schemaUrl },
      remoteAgents: [
        {
          url: agentUrl,
          enabledMethods: Object.keys(schema["x-methods"]),
          token: apiKey,
        },
      ],
    });
    notification.success({
      message: "Added " + name,
    });
  };

  const {
    data: schema,
    isLoading: schemaLoading,
    isError: schemaError,
  } = useQuery(
    ["schema", { endpoint: schemaUrl }],
    async () => {
      if (schemaUrl) {
        try {
          const response = await fetch(schemaUrl);
          const json = await response.json();
          setJsonError(false);
          return json;
        } catch (e) {
          //nothing
          setJsonError(true);
        }
      }
    },
    {
      enabled: !!schemaUrl,
    }
  );

  useEffect(() => {
    setAgentUrl(schema?.servers[0]?.url);
    setName(schema?.info?.title);

    return () => {
      setAgentUrl("");
      setName("");
    };
  }, [schema]);

  const methods = () => {
    return (
      schema &&
      schema["x-methods"] && (
        <div
          style={{
            height: 300,
            margin: "20px 0",
            overflow: "scroll",
            border: "1px solid #e8e8e8",
            borderRadius: 4,
            padding: "8px 24px",
          }}
        >
          <List
            header={
              <Typography.Title level={5}>Available methods</Typography.Title>
            }
            dataSource={Object.keys(schema["x-methods"])}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text>{item}</Typography.Text>
              </List.Item>
            )}
          />
        </div>
      )
    );
  };

  return (
    <Card
      title="Personal Agent"
      bordered={false}
      style={{
        borderTop: "1px solid #2d2d2d",
        borderBottom: "1px solid #2d2d2d",
      }}
    >
      {agent ? (
        <Row>
          <Col flex={1}>Disconnect your personal agent from this app</Col>
          <Col>
            <Button
              type="primary"
              shape="round"
              danger
              onClick={() => removeAgent("privateAgent")}
            >
              Disconnect
            </Button>
          </Col>
        </Row>
      ) : (
        <Form layout={"vertical"}>
          <Form.Item
            hasFeedback
            validateStatus={
              !schemaUrl
                ? ""
                : schemaLoading
                ? "validating"
                : schemaError || jsonError
                ? "error"
                : "success"
            }
            label="Agent Schema URL"
          >
            <Input
              style={{
                padding: 10,
                fontSize: 16,
                borderRadius: 10,
              }}
              id="validating"
              size="large"
              placeholder="Agent schema"
              value={schemaUrl}
              onChange={(e) => setSchemaUrl(e.target.value)}
            />
          </Form.Item>
          {methods()}
          {schema && (
            <>
              <Form.Item label="Agent name">
                <Input
                  size="large"
                  placeholder="Remote Agent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Agent Url">
                <Input
                  size="large"
                  placeholder="Agent Url"
                  value={agentUrl}
                  onChange={(e) => setAgentUrl(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="API Key">
                <Input
                  size="large"
                  placeholder="API Key"
                  value={apiKey}
                  type="password"
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  size="large"
                  type="primary"
                  block
                  shape="round"
                  disabled={!name || !schemaUrl || !apiKey || !agentUrl}
                  onClick={() => newAgentConfig()}
                >
                  Submit
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
      )}
    </Card>
  );
};

export default CloudConnect;
