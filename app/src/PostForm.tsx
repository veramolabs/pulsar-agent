import React, { useState } from "react";
import { Button, Form, Input, Select, notification, Progress } from "antd";
import { useVeramo } from "@veramo-community/veramo-react";
import { IDIDManager, IDataStore, TAgent, IMessageHandler } from "@veramo/core";
import shortId from "shortid";
import { IProfileManager } from "./web3/ProfileManager";
import { useQuery } from "react-query";
import IdentifierProfileSelectOption from "./IdentifierProfileSelectOption";

interface Props {
  id?: string;
  onFinish?: () => void;
}

interface FormValues {
  from: string;
  articleBody: string;
}

const Module: React.FC<Props> = (props: Props) => {
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

  const [progressStatus, setProgressStatus] = useState<
    "active" | "exception" | undefined
  >(undefined);
  const [progress, setProgress] = useState<number | undefined>(undefined);

  const { data: identifiers, isLoading: isLoadingIdentifiers } = useQuery(
    ["managedIdentifiers"],
    () => agent?.didManagerFind()
  );

  const initialValues: FormValues = {
    from: "",
    articleBody: "",
  };

  const createPost = async (values: FormValues) => {
    setProgressStatus("active");
    setProgress(20);
    try {
      const profile = await agent?.getProfile({ did: values.from });
      const credentialId = "https://pulsar.veramo.io/posts/" + shortId();

      const verifiableCredential = await agent?.createVerifiableCredential({
        credential: {
          issuer: { id: values.from },
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
              id: values.from,
              image: profile?.picture,
              name: profile?.name,
            },
            headline: "",
            articleBody: values.articleBody,
          },
        },
        proofFormat: "jwt",
      });

      setProgress(80);

      try {
        await agent?.sendMessageDIDCommAlpha1({
          data: {
            from: values.from,
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
      setProgress(undefined);
      if (props.onFinish) {
        props.onFinish();
      }
    }, 1000);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      initialValues={initialValues}
      onFinish={createPost}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="from"
        rules={[{ required: true, message: "Please select From!" }]}
      >
        <Select loading={isLoadingIdentifiers}>
          {identifiers?.map((i) => (
            <Select.Option value={i.did} key={i.did}>
              <IdentifierProfileSelectOption did={i.did} />
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="articleBody"
        rules={[{ required: true, message: "Please input Article body!" }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        {progress === undefined && (
          <Button type="primary" htmlType="submit">
            Post
          </Button>
        )}
        {progress && <Progress percent={progress} status={progressStatus} />}
      </Form.Item>
    </Form>
  );
};

export default Module;
