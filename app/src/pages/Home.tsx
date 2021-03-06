import React, { useState } from "react";
import { Typography, Layout } from "antd";
import Page from "../layout/Page";
import Stream from "../components/Stream";
import Connect from "../components/Connect";
import NewPost from "../components/NewPost";
import { useVeramo } from "@veramo-community/veramo-react";

const { Title } = Typography;

const Home = () => {
  const [refetch, setRefetch] = useState<boolean>();
  const { getAgent } = useVeramo();
  const agent = getAgent("clientAgent");
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
      <NewPost setRefetch={setRefetch} />
      <Stream agent={agent} refetch={refetch} setRefetch={setRefetch} />
    </Page>
  );
};

export default Home;
