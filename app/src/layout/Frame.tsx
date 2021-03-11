import React from "react";
import { Route } from "react-router-dom";
import { Layout, Button, Popover, List, Col, Row } from "antd";
import LeftMenu from "./LeftMenu";
import Explore from "../pages/Explore";

const { Content } = Layout;

const Frame = () => {
  return (
    <Layout style={{ height: "100%" }}>
      <Layout>
        <Content className="main-content-container">
          <Row>
            <Col xs={3} sm={4} md={5}>
              <LeftMenu />
            </Col>
            <Col xs={21} sm={20} md={19}>
              <Route path="/" exact component={Explore} />
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Frame;
