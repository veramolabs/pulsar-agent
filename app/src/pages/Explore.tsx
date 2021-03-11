import React from "react";
import { Typography, Card, Layout, Button, Row, Col } from "antd";
import Page from "../layout/Page";
import Stream from "../components/Stream";

const { Title, Text } = Typography;

const Explore = () => {
  const rightContent = () => {
    return (
      <Layout style={{ paddingLeft: 15, paddingTop: 15 }}>
        <Card>
          <Title level={3}>Login with Metamask</Title>
          <Text>Post as a DID or NFT!</Text>
          <div style={{ marginTop: 20 }}>
            <Button
              type="primary"
              size="large"
              shape="round"
              style={{ width: "100%" }}
            >
              Connect
            </Button>
          </div>
        </Card>
      </Layout>
    );
  };

  return (
    <Page
      header={
        <Title level={4} style={{ fontWeight: "bold" }}>
          Explore
        </Title>
      }
      rightContent={rightContent()}
    >
      <Stream />
    </Page>
  );
};

export default Explore;
