import React from "react";
import { Avatar, Card, Dropdown, List, Menu } from "antd";
import { useQuery } from "react-query";
import { useVeramo } from "@veramo-community/veramo-react";
import { formatDistanceToNow } from "date-fns";
import { MoreOutlined, EuroOutlined, CodeOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const Stream = () => {
  const { getAgent } = useVeramo();
  const agent = getAgent("clientAgent");
  const history = useHistory();
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

  console.log(credentials);

  return (
    <List
      itemLayout="horizontal"
      dataSource={credentials}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="0" icon={<CodeOutlined />}>
                    <a href="/">Show credential</a>
                  </Menu.Item>
                  {item.verifiableCredential.issuer.id.split(":")[1] ===
                    "nft" && (
                    <Menu.Item key="1" icon={<EuroOutlined />}>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`https://opensea.io/assets/${
                          item.verifiableCredential.issuer.id.split(":")[3]
                        }/${item.verifiableCredential.issuer.id.split(":")[4]}`}
                      >
                        Asset details
                      </a>
                    </Menu.Item>
                  )}
                </Menu>
              }
              trigger={["click"]}
            >
              <MoreOutlined />
            </Dropdown>,
          ]}
        >
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
                <a
                  href={
                    "/profile/" +
                    item.verifiableCredential.credentialSubject.author?.id
                  }
                >
                  {item.verifiableCredential.credentialSubject.author?.name}
                </a>
              }
              description={`${formatDistanceToNow(
                Date.parse(item.verifiableCredential.issuanceDate)
              )} ago`}
            />
            <div
              className={"clickable-content"}
              style={{ paddingTop: 15, fontSize: "1rem", marginLeft: 72 }}
              onClick={() => history.push("/post/" + item?.hash)}
            >
              {item.verifiableCredential.credentialSubject?.articleBody}
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default Stream;
