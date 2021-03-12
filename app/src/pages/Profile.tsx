import React from "react";
import { Typography, Layout } from "antd";
import Page from "../layout/Page";
import Connect from "../components/Connect";
import { Avatar, Card, Row, Button } from "antd";
import { useQuery } from "react-query";
import { useVeramo } from "@veramo-community/veramo-react";
import { useParams, useHistory } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Post = () => {
  const { getAgent } = useVeramo();
  const { did } = useParams<{ did: string }>();
  const history = useHistory();

  const agent = getAgent("clientAgent");
  const { data, isLoading } = useQuery(
    ["profile" + did, { agentId: agent?.context.id }],
    () => agent?.getProfile({ did: did }),
    {
      enabled: !!did,
      initialData: {
        did: "",
        name: "",
        nickname: did,
        picture: "",
        currentOwner: { user: { username: "" } },
      },
    }
  );

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
        <Row style={{ alignItems: "center" }}>
          <ArrowLeftOutlined
            onClick={() => history.goBack()}
            style={{ fontSize: 20, marginBottom: 10, marginRight: 10 }}
          />
          <Title level={4} style={{ fontWeight: "bold" }}>
            {data?.name}
          </Title>
        </Row>
      }
      rightContent={rightContent()}
    >
      <Card
        bordered={false}
        style={{ width: "100%" }}
        loading={isLoading}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ height: 200, backgroundColor: "yellow" }}>
          <img src="https://random.imagecdn.app/800/200" loading="eager" />
        </div>
        <div style={{ padding: 20 }}>
          {data && (
            <div>
              <div
                style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  type="default"
                  size="large"
                  shape="round"
                  onClick={() =>
                    (window.location.href = `https://opensea.io/accounts/${data?.currentOwner.user.username}`)
                  }
                >
                  View on OpenSea
                </Button>
              </div>
              <div style={{ marginTop: -80, marginLeft: 20, marginBottom: 10 }}>
                <Avatar src={data?.picture} size={150} />
              </div>
              <Title>{data?.name}</Title>
              <p>
                Owned by{" "}
                <a
                  href={`https://opensea.io/accounts/${data?.currentOwner.user.username}`}
                >
                  {data?.currentOwner.user.username}{" "}
                </a>
                on OpenSea
              </p>
            </div>
          )}
        </div>
      </Card>
    </Page>
  );
};

export default Post;
