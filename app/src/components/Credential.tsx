import React from "react";
import { Avatar, Card, Typography, Row, Col } from "antd";
import { formatDistanceToNow, format } from "date-fns";

const Sugar = require("sugar");

interface CredentialProps {
  vc: any;
}

const Credential: React.FC<CredentialProps> = ({ vc }) => {
  const credentialSubject = vc?.credentialSubject;

  const renderKeys = (keys: any) => {
    return Object.keys(keys).map((key, index) => {
      return (
        <Col key={index} style={{ marginTop: 8 }}>
          <Row>
            <Typography.Text
              style={{ fontSize: 14, fontWeight: "bold", color: "#555" }}
            >
              {key}
            </Typography.Text>
          </Row>
          <Row>{renderFields(keys[key])}</Row>
        </Col>
      );
    });
  };

  const renderFields = (field: any) => {
    switch (typeof field) {
      case "string":
        console.log("STRING!", field);
        return (
          <Typography.Text
            style={{
              fontSize: 16,
              overflowWrap: "anywhere",
              fontFamily: "Consolas",
            }}
          >
            {field || "NA"}
          </Typography.Text>
        );
      case "object":
        console.log("OBJECT!", field);
        return (
          <Col style={{ paddingLeft: 10, borderLeft: "5px solid #222" }}>
            {renderKeys(field)}
          </Col>
        );
    }
  };

  return (
    <Card
      loading={!vc}
      style={{ borderRadius: 10, backgroundColor: "#0a0a0a" }}
    >
      <Card.Meta
        avatar={
          <Avatar src={vc?.credentialSubject.author?.image} size="large" />
        }
        title={<h4>{vc?.credentialSubject.author?.name}</h4>}
        description={`${formatDistanceToNow(Date.parse(vc?.issuanceDate))} ago`}
      />
      <Col style={{ marginLeft: 74, marginTop: 20 }}>
        {renderKeys(credentialSubject)}
        {renderKeys({
          issuanceDate: format(new Date(vc.issuanceDate), "dd MMM yyyy"),
        })}
        {/* {renderKeys({
          type: vc.type,
        })} */}
      </Col>
    </Card>
  );
};

export default Credential;
