import React, { useEffect } from "react";
import { Avatar, Button, Card, List, Space, notification } from "antd";
import { useQuery } from "react-query";
import { useVeramo } from "@veramo-community/veramo-react";
import { formatDistanceToNow } from "date-fns";
import { useHistory } from "react-router-dom";
import { ShareAltOutlined } from '@ant-design/icons';
interface Props {
  setRefetch?: (refetch: boolean) => void;
  refetch?: boolean;
}

const Stream: React.FC<Props> = ({ setRefetch, refetch }) => {
  const { getAgent } = useVeramo();
  const agent = getAgent("clientAgent");
  const history = useHistory();
  const { data: credentials, refetch: refetchQuery } = useQuery(
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

  useEffect(() => {
    if (refetch) {
      refetchQuery();
      setRefetch && setRefetch(false);
    }
  }, [refetch]);

  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={credentials}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Button 

              shape="circle"
              icon={<ShareAltOutlined />} 
              onClick={async () => {
                try {
                  navigator.clipboard.writeText(`${item.verifiableCredential.id}`)
                  notification.success({ message: 'URL copied!' })
                } catch(err) {
                  notification.error({ message: err.message })
                }
              }}
            />
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
                  onClick={() =>
                    history.push(
                      "/profile/" +
                      item.verifiableCredential.credentialSubject.author?.id
                    )
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
              onClick={() => history.push("/post/" + item?.verifiableCredential.id?.split('/').pop())}
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
