import React from "react";
import { Typography, Layout } from "antd";
import Page from "../layout/Page";
import Stream from "../components/Stream";
import Connect from "../components/Connect";

const { Title} = Typography;

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
