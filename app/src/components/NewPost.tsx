import React, { useEffect, useState } from "react";
import { Button, Input, notification, Progress, Card, Tag } from "antd";
import { useVeramo } from "@veramo-community/veramo-react";
import { IDIDManager, IDataStore, TAgent, IMessageHandler } from "@veramo/core";
import shortId from "shortid";
import { IProfileManager } from "../web3/ProfileManager";
import { useQuery } from "react-query";
import IdentifierSelect from "../components/IdentifierSelect";

interface Props {
  id?: string;
  onFinish?: () => void;
  setRefetch: (refetch: boolean) => void;
  recipientDid?: string;
}

const NewPost: React.FC<Props> = (props: Props) => {
  const { getAgent } = useVeramo<
    IDIDManager & IDataStore & IProfileManager & IMessageHandler
  >();
  let agent: TAgent<
    IDIDManager & IDataStore & IProfileManager & IMessageHandler
  >;
  try {
    agent = getAgent("web3Agent");
  } catch (e) {
    console.log(e.message);
  }

  const [selectedDid, setSelectedDid] = useState<string>();
  const [postContent, setPostContent] = useState<string>();
  const [progressStatus, setProgressStatus] = useState<
    "active" | "exception" | undefined
  >(undefined);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [dmsOpen, setDmsOpen] = useState(false);

  const { data: identifiers, isLoading: isLoadingIdentifiers } = useQuery(
    ["managedIdentifiers"],
    () => agent?.didManagerFind()
  );

  const { data: identity, isLoading: isLoadingIdentity } = useQuery(
    ["identifier"],
    () => agent?.resolveDid({ didUrl: props.recipientDid }),
    {
      enabled: !!props.recipientDid,
    }
  );

  useEffect(() => {
    console.log(identity);

    if (identity && identity.service) {
      const messaging = identity.service.find(
        (i: any) => i.type === "Messaging"
      );

      if (messaging) {
        setDmsOpen(true);
      } else {
        setDmsOpen(false);
      }
    } else {
      setDmsOpen(false);
    }
  }, [identity]);

  const [disabled, setDisabled] = useState<Boolean>(false);

  useEffect(() => {
    if (identifiers && selectedDid === undefined) {
      if (identifiers.length > 1) {
        setSelectedDid(identifiers[1].did);
      } else {
        setSelectedDid(identifiers[0].did);
      }
    }
  }, [selectedDid, identifiers]);

  // useEffect(() => {
  //   if (!selectedDid?.startsWith("did:nft:")) {
  //     setDisabled(true);
  //   } else {
  //     setDisabled(false);
  //   }
  // }, [selectedDid]);

  const createPost = async () => {
    if (!process.env.REACT_APP_BASE_URL)
      throw Error("REACT_APP_BASE_URL is missing");
    if (!process.env.REACT_APP_DEFAULT_RECIPIENT)
      throw Error("REACT_APP_DEFAULT_RECIPIENT is missing");

    setProgressStatus("active");
    setProgress(20);
    try {
      const profile = await agent?.getProfile({ did: selectedDid });
      const credentialId =
        process.env.REACT_APP_BASE_URL + "/post/" + shortId();

      const verifiableCredential = await agent?.createVerifiableCredential({
        credential: {
          issuer: { id: selectedDid },
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3id.org/veramolabs/socialmedia/context/v1",
          ],
          type: ["VerifiableCredential", "VerifiableSocialPosting"],
          credentialSchema: {
            id: "https://www.w3id.org/veramolabs/socialmedia/context/v1/eip712.json",
            type: "Eip712SchemaValidator2021",
          },
          id: credentialId,
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: credentialId,
            type: "SocialMediaPosting",
            author: {
              id: selectedDid,
              image: profile?.picture,
              name: profile?.name,
            },
            headline: "",
            articleBody: postContent,
          },
        },
        proofFormat: "jwt",
      });

      setProgress(80);

      try {
        await agent?.sendMessageDIDCommAlpha1({
          data: {
            from: selectedDid,
            to: props.recipientDid || process.env.REACT_APP_DEFAULT_RECIPIENT,
            body: verifiableCredential.proof.jwt,
            type: "jwt",
          },
        });

        notification.success({
          message:
            "Message sent to: " + process.env.REACT_APP_DEFAULT_RECIPIENT,
        });
      } catch (e) {
        notification.error({
          message: e.message,
        });
        setProgressStatus("exception");
      }
    } catch (e) {
      notification.error({
        message: e.message,
      });
      setProgressStatus("exception");
    }
    setProgress(100);

    setTimeout(() => {
      setPostContent("");
      setProgress(undefined);
      props.setRefetch(true);

      if (props.onFinish) {
        props.onFinish();
      }
    }, 1000);
  };

  return (
    <div style={{ position: "relative" }}>
      <Card
        loading={isLoadingIdentifiers || !selectedDid}
        bordered={false}
        style={{ borderBottom: "1px solid #2b2b2b" }}
      >
        <Card.Meta
          avatar={
            identifiers && (
              <IdentifierSelect
                identifiers={identifiers}
                did={selectedDid}
                setSelectedDid={setSelectedDid}
              />
            )
          }
          description={
            <div>
              <Tag style={{ marginLeft: 90, marginTop: -10 }}>
                {props.recipientDid ? "Private" : "Public"}
              </Tag>
              <Input.TextArea
                rows={1}
                style={{
                  border: 0,
                  fontSize: 25,
                  marginLeft: 80,
                  boxShadow: "none",
                }}
                placeholder={
                  !!disabled
                    ? "Oops, NFTs only allowed around here"
                    : props.recipientDid
                    ? dmsOpen
                      ? "Hey my DMs are open. What's up?"
                      : "DMs closed"
                    : "Hey, What's up?"
                }
                onChange={(e) => setPostContent(e.target.value)}
                value={postContent}
              ></Input.TextArea>
            </div>
          }
        />
        <div
          style={{
            marginTop: 15,
            display: "flex",
            justifyContent: "flex-end",
            flex: 1,
          }}
        >
          <Button
            disabled={
              !!disabled || !postContent || (props.recipientDid && !dmsOpen)
            }
            type="primary"
            size="large"
            shape="round"
            style={{ width: 180 }}
            onClick={() => createPost()}
          >
            {props.recipientDid ? (
              <b>Private Message</b>
            ) : (
              <b>Public Message</b>
            )}
          </Button>
        </div>
      </Card>
      <Progress
        style={{ position: "absolute", bottom: -5 }}
        strokeLinecap="square"
        percent={progress}
        showInfo={false}
        status={progressStatus}
      />{" "}
    </div>
  );
};

export default NewPost;
