import React, { useEffect, useState } from "react";
import { Button, Input, notification, Progress, Card } from "antd";
import { useVeramo } from "@veramo-community/veramo-react";
import { IDIDManager, IDataStore, TAgent, IMessageHandler } from "@veramo/core";
import shortId from "shortid";
import { IProfileManager } from "../web3/ProfileManager";
import { useQuery } from "react-query";
import IdentifierSelect from "../components/IdentifierSelect";

interface Props {
  id?: string;
  onFinish?: () => void;
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

  const { data: identifiers, isLoading: isLoadingIdentifiers } = useQuery(
    ["managedIdentifiers"],
    () => agent?.didManagerFind()
  );

  useEffect(() => {
    if (identifiers && selectedDid === undefined) {
      setSelectedDid(identifiers[0].did);
    }
  }, [selectedDid, identifiers]);

  const createPost = async () => {
    setProgressStatus("active");
    setProgress(20);
    try {
      const profile = await agent?.getProfile({ did: selectedDid });
      const credentialId = "https://pulsar.veramo.io/posts/" + shortId();

      const verifiableCredential = await agent?.createVerifiableCredential({
        credential: {
          issuer: { id: selectedDid },
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3id.org/veramolabs/socialmedia/context/v1",
          ],
          type: ["VerifiableCredential", "VerifiableSocialPosting"],
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
            to: "did:web:pulsar.veramo.io",
            body: verifiableCredential.proof.jwt,
            type: "jwt",
          },
        });

        notification.success({
          message: "Message sent to: did:web:pulsar.veramo.io",
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
            <Input.TextArea
              rows={1}
              style={{ border: 0, fontSize: 25 }}
              placeholder={"Hey, What's up?"}
              onChange={(e) => setPostContent(e.target.value)}
              value={postContent}
            ></Input.TextArea>
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
            disabled={!postContent}
            type="primary"
            size="large"
            shape="round"
            style={{ width: 100 }}
            onClick={() => createPost()}
          >
            <b>Say it</b>
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
