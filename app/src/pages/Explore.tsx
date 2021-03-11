import React from "react";
import { Typography, Card, Layout, Button, Row, Col } from "antd";
import Page from "../layout/Page";
import Stream from "../components/Stream";
import Connect from "../components/Connect";

const { Title, Text } = Typography;

const Explore = () => {
  const rightContent = () => {
    return (
      <Layout style={{ paddingLeft: 15, paddingTop: 15 }}>
        <Connect />
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
