import React from "react";
import { Redirect, Route } from "react-router-dom";
import { Layout, Button, Popover, List, Col, Row } from "antd";
import LeftMenu from "./LeftMenu";
import Explore from "../pages/Explore";
import Home from "../pages/Home";
import { useVeramo } from "@veramo-community/veramo-react";

const { Content } = Layout;

const Frame = () => {
  const { getAgent } = useVeramo();
  let web3Agent;
  try {
    web3Agent = getAgent("web3Agent");
  } catch (e) {}

  return (
    <Layout style={{ height: "100%" }}>
      <Layout>
        <Content className="main-content-container">
          <Row>
            <Col xs={3} sm={4} md={5}>
              <LeftMenu web3Agent={web3Agent} />
            </Col>
            <Col xs={21} sm={20} md={19}>
              {web3Agent && <Redirect to="/home" />}
              {!web3Agent && <Redirect to="/" />}
              <Route path="/" exact component={Explore} />
              <Route path="/home" component={Home} />
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Frame;
