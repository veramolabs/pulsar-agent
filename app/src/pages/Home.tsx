import React from "react";
import { Typography, Card, Layout, Button, Row, Col } from "antd";
import Page from "../layout/Page";
import Stream from "../components/Stream";
import Connect from "../components/Connect";
import NewPost from "../components/NewPost";

const { Title, Text } = Typography;

const Home = () => {
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
          Home
        </Title>
      }
      rightContent={rightContent()}
    >
      <NewPost />
      <Stream />
    </Page>
  );
};

export default Home;
