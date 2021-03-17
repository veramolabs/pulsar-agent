import React, { useEffect } from "react";
import { Avatar, Button, Card, List, notification } from "antd";
import { useQuery } from "react-query";

import { formatDistanceToNow } from "date-fns";
import { useHistory } from "react-router-dom";
import {
  ShareAltOutlined,
  HeartOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { TAgent } from "@veramo/core";
import { IDataStoreORM } from "@veramo/data-store";
interface Props {
  setRefetch?: (refetch: boolean) => void;
  refetch?: boolean;
  agent: TAgent<IDataStoreORM>;
  privateMode?: boolean;
  did?: string;
}

const Stream: React.FC<Props> = ({
  setRefetch,
  refetch,
  agent,
  privateMode,
  did,
}) => {
  const history = useHistory();

  const typeQuery = [
    {
      column: "type",
      value: ["VerifiableCredential,VerifiableSocialPosting"],
    },
  ];

  const didQuery = [
    {
      column: "issuer",
      value: [did],
    },
  ];

  // @ts-ignore
  const query = did ? typeQuery.concat(didQuery) : typeQuery;

  const { data: credentials, isLoading, refetch: refetchQuery } = useQuery(
    ["credentials", { agentId: agent?.context.name }],
    () =>
      agent.dataStoreORMGetVerifiableCredentials({
        // @ts-ignore
        where: query,
        order: [{ column: "issuanceDate", direction: "DESC" }],
      })
  );

  useEffect(() => {
    if (refetch) {
      refetchQuery();
      setRefetch && setRefetch(false);
    }
  }, [refetch, refetchQuery, setRefetch]);

  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={credentials?.filter((item) => {
        return did ? item.verifiableCredential.issuer.id == did : item;
      })}
      loading={isLoading}
      renderItem={(item) => {
        return (
          <List.Item
            className="main-post"
            actions={
              !privateMode
                ? [
                    <Button
                      shape="circle"
                      style={{ border: 0 }}
                      icon={<CommentOutlined />}
                      onClick={async () => {
                        try {
                          navigator.clipboard.writeText(
                            `${item.verifiableCredential.id}`
                          );
                          notification.success({ message: "URL copied!" });
                        } catch (err) {
                          notification.error({ message: err.message });
                        }
                      }}
                    />,
                    <Button
                      shape="circle"
                      style={{ border: 0 }}
                      icon={<HeartOutlined />}
                      onClick={async () => {
                        try {
                          navigator.clipboard.writeText(
                            `${item.verifiableCredential.id}`
                          );
                          notification.success({ message: "URL copied!" });
                        } catch (err) {
                          notification.error({ message: err.message });
                        }
                      }}
                    />,
                    <Button
                      shape="circle"
                      style={{ border: 0 }}
                      icon={<ShareAltOutlined />}
                      onClick={async () => {
                        try {
                          navigator.clipboard.writeText(
                            `${item.verifiableCredential.id}`
                          );
                          notification.success({ message: "URL copied!" });
                        } catch (err) {
                          notification.error({ message: err.message });
                        }
                      }}
                    />,
                  ]
                : []
            }
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
                  <Button
                    type="text"
                    style={{ padding: 0, fontSize: 18 }}
                    onClick={() =>
                      history.push(
                        "/profile/" +
                          item.verifiableCredential.credentialSubject.author?.id
                      )
                    }
                  >
                    {item.verifiableCredential.credentialSubject.author?.name}
                  </Button>
                }
                description={`${formatDistanceToNow(
                  Date.parse(item.verifiableCredential.issuanceDate)
                )} ago`}
              />
              <div
                className={"clickable-content"}
                style={{
                  paddingTop: 15,
                  fontSize: "1.3rem",
                  marginLeft: 72,
                }}
                onClick={() =>
                  history.push(
                    "/post/" + item?.verifiableCredential.id?.split("/").pop()
                  )
                }
              >
                {item.verifiableCredential.credentialSubject?.articleBody}
              </div>
            </Card>
          </List.Item>
        );
      }}
    />
  );
};

export default Stream;
