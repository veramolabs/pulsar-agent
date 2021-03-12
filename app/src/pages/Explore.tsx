import React from "react";
import { Typography, Layout } from "antd";
import Page from "../layout/Page";
import Stream from "../components/Stream";
import Connect from "../components/Connect";

import article from "../static/img/article.jpeg";

const { Title } = Typography;

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
      <div style={{ borderBottom: "1px solid #2d2d2d" }}>
        <div style={{ height: 400, overflow: "hidden" }}>
          <img src={article} width="100%" />
        </div>
        <div style={{ padding: 15 }}>
          <Title level={2}>
            An NFT just sold for a record $69m. (Let us explain what that
            means.)
          </Title>
          <p>
            “Everydays — The First 5000 Days,” by the artist known as Beeple,
            set a record for a digital artwork in a sale at Christie’s. It's a
            big day for #nftcollectors.
          </p>
        </div>
      </div>
      <Stream />
    </Page>
  );
};

export default Explore;
