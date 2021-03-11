import React from "react";
import { Avatar, Card, List } from "antd";
import { useQuery } from "react-query";
import { useVeramo } from "@veramo-community/veramo-react";
import { formatDistanceToNow } from "date-fns";

const Stream = () => {
  const { getAgent } = useVeramo();
  const agent = getAgent("clientAgent");
  let web3Agent;
  try {
    web3Agent = getAgent("web3Agent");
  } catch (e) {}

  const { data: credentials } = useQuery(
    ["credentials", { agentId: agent?.context.name }],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [
          {
            column: "type",
            value: ["VerifiableCredential,VerifiableSocialPosting"],
          },
        ],
        order: [{ column: "issuanceDate", direction: "DESC" }],
      })
  );

  return (
    <List
      itemLayout="horizontal"
      dataSource={credentials}
      renderItem={(item) => (
        <List.Item>
          <Card bordered={false} style={{ width: "100%" }}>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={
                    item.verifiableCredential.credentialSubject.author?.image
                  }
                  size="large"
                />
              }
              title={
                <a href={"/credential/" + item.hash}>
                  {item.verifiableCredential.credentialSubject.author?.name}
                </a>
              }
              description={`${formatDistanceToNow(
                Date.parse(item.verifiableCredential.issuanceDate)
              )} ago`}
            />
            <div style={{ paddingTop: 15, fontSize: "1rem", marginLeft: 72 }}>
              {item.verifiableCredential.credentialSubject?.articleBody}
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default Stream;
