import React from "react";
import { Typography, Layout } from "antd";
import Page from "../layout/Page";

import Connect from "../components/Connect";

import { Avatar, Card, Row, Skeleton } from "antd";
import { useQuery } from "react-query";
import { useVeramo } from "@veramo-community/veramo-react";
import { formatDistanceToNow } from "date-fns";
import { useParams, useHistory } from "react-router-dom";

import {
  ArrowLeftOutlined,
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const Post = () => {
  const { getAgent } = useVeramo();
  const agent = getAgent("clientAgent");
  const { postId } = useParams<{ postId: string }>();
  const history = useHistory();

  const { data: post, isLoading } = useQuery(
    ["post", { postId, agentId: agent?.context.name }],
    () => agent?.dataStoreGetVerifiableCredential({ hash: postId })
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
            Post
          </Title>
        </Row>
      }
      rightContent={rightContent()}
    >
      <Card bordered={false} style={{ width: "100%" }} loading={isLoading}>
        {post && (
          <>
            <Card.Meta
              avatar={
                <Avatar
                  src={post?.credentialSubject.author?.image}
                  size="large"
                />
              }
              title={
                <h4>
                  <a href={"/profile/" + post?.credentialSubject.author?.id}>
                    {post?.credentialSubject.author?.name}
                  </a>
                </h4>
              }
              description={`${formatDistanceToNow(
                Date.parse(post?.issuanceDate)
              )} ago`}
            />
            <div style={{ paddingTop: 15, fontSize: "1rem", marginLeft: 72 }}>
              {post?.credentialSubject?.articleBody}
              <Card
                style={{ width: "100%", marginTop: 40 }}
                actions={[
                  <SettingOutlined key="setting" />,
                  <EditOutlined key="edit" />,
                  <EllipsisOutlined key="ellipsis" />,
                ]}
              >
                <Skeleton loading={false} avatar active>
                  <h3>Verifiable Credential</h3>
                  <pre>
                    <code>{JSON.stringify(post, null, 2)}</code>
                  </pre>
                </Skeleton>
              </Card>
            </div>
          </>
        )}
      </Card>
    </Page>
  );
};

export default Post;
