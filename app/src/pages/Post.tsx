import React, { useState } from "react";
import { Typography, Layout } from "antd";
import Page from "../layout/Page";

import Connect from "../components/Connect";

import { Avatar, Card, Row, Button } from "antd";
import { useQuery } from "react-query";
import { useVeramo } from "@veramo-community/veramo-react";
import { formatDistanceToNow } from "date-fns";
import { useParams, useHistory } from "react-router-dom";
import Credential from "../components/Credential";
import QRCode from "qrcode.react";

import {
  ArrowLeftOutlined,
  QrcodeOutlined,
  IdcardOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const Post = () => {
  const { getAgent } = useVeramo();
  const agent = getAgent("clientAgent");
  const { postId } = useParams<{ postId: string }>();
  const history = useHistory();

  const [vcVisible, toggleVCVisible] = useState<boolean>(false);
  const [qrCodeVisible, toggleQRVisible] = useState<boolean>(false);

  if (!process.env.REACT_APP_BASE_URL)
    throw Error("REACT_APP_BASE_URL is missing");

  const { data: post, isLoading } = useQuery(
    ["post", { postId, agentId: agent?.context.name }],
    () =>
      agent
        ?.dataStoreORMGetVerifiableCredentials({
          where: [
            {
              column: "id",
              value: [`${process.env.REACT_APP_BASE_URL}/post/${postId}`],
            },
          ],
          take: 1,
        })
        .then((r) => r[0].verifiableCredential)
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
      <Card
        bordered={false}
        style={{ width: "100%" }}
        loading={isLoading}
        actions={[
          <QrcodeOutlined
            key="qr"
            style={{ fontSize: 25 }}
            onClick={() => {
              toggleVCVisible((s) => !s);
              toggleQRVisible(false);
            }}
          />,
          <IdcardOutlined
            key="vc"
            style={{ fontSize: 25 }}
            onClick={() => {
              toggleQRVisible((s) => !s);
              toggleVCVisible(false);
            }}
          />,
          <Button
            type="link"
            icon={<DownloadOutlined key="dl" style={{ fontSize: 25 }} />}
            key="dl"
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(
              JSON.stringify(post, null, 2)
            )}`}
            download={"post.txt"}
          ></Button>,
        ]}
      >
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
            <div style={{ paddingTop: 20, paddingBottom: 20, marginLeft: 72 }}>
              <div style={{ fontSize: "1.3rem" }}>
                {post?.credentialSubject?.articleBody}
              </div>
              {qrCodeVisible && (
                <div style={{ paddingTop: 25 }}>
                  {post && <Credential vc={post} />}
                </div>
              )}
              {vcVisible && (
                <div style={{ paddingTop: 25 }}>
                  {post && (
                    <Card
                      style={{
                        borderRadius: 10,
                        backgroundColor: "#0a0a0a",
                        textAlign: "center",
                      }}
                    >
                      <QRCode
                        value={post.id || ""}
                        size={400}
                        style={{ margin: 50 }}
                      />
                      <Typography.Text>
                        Scan QR code with your mobile device
                      </Typography.Text>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </Page>
  );
};

export default Post;
