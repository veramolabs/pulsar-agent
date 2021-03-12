import React, { useState } from "react";
import { useQuery } from "react-query";
import { useVeramo } from "@veramo-community/veramo-react";
import { IProfileManager } from "../web3/ProfileManager";
import { Avatar } from "antd";

interface Props {
  did: string | undefined;
  identifiers: any[];
  setSelectedDid: (did: string) => void;
}

const Profile = ({
  did,
  onClick,
}: {
  did: string;
  onClick: (did: string) => void;
}) => {
  const { getAgent } = useVeramo<IProfileManager>();
  const agent = getAgent("clientAgent");
  const { data } = useQuery(
    ["profile" + did, { agentId: agent?.context.id }],
    () => agent?.getProfile({ did: did }),
    {
      enabled: !!did,
      initialData: {
        did: did,
        name: did,
        nickname: did,
        picture: "",
      },
    }
  );

  return (
    <div style={{ marginTop: 10 }} onClick={() => onClick(did)}>
      <Avatar src={data?.picture} size={60} />
    </div>
  );
};

const Module: React.FC<Props> = ({ did, identifiers, setSelectedDid }) => {
  const [selectionMode, toggleSelectionMode] = useState(false);

  const { getAgent } = useVeramo<IProfileManager>();
  const agent = getAgent("clientAgent");
  const { data } = useQuery(
    ["profile" + did, { agentId: agent?.context.id }],
    () => agent?.getProfile({ did: did }),
    {
      enabled: !!did,
      initialData: {
        did: did,
        name: did,
        nickname: did,
        picture: "",
      },
    }
  );

  return (
    <div
      style={{ position: "relative" }}
      onClick={() => toggleSelectionMode((s) => !s)}
    >
      <div
        style={{
          border: selectionMode ? "1px solid #2d2d2d" : "1px solid #000000",
          padding: 10,
          top: -10,
          borderRadius: 100,
          background: "black",
          position: "absolute",
          zIndex: 10,
        }}
      >
        <Avatar src={data?.picture} size={60} />
        {identifiers.map((item) => {
          return (
            item.did !== did &&
            selectionMode && <Profile key={item.did} did={item.did} onClick={setSelectedDid} />
          );
        })}
      </div>
    </div>
  );

  // return <Avatar />;
};

export default Module;
