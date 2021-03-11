import React, { useState, useEffect, Suspense } from "react";
import { Layout, Button, Popover, List, Col, Row } from "antd";
import { FundViewOutlined } from "@ant-design/icons";

interface PageProps {
  name?: string;
  header: any;
  rightContent?: any;
  fullWidth?: boolean;
}

const Page: React.FC<PageProps> = ({ children, header, rightContent }) => {
  return (
    <div>
      <Layout>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={rightContent ? 16 : 24}>
            <div
              style={{
                padding: "15px 15px 10px 15px",
                borderBottom: "1px solid #2b2b2b",
                borderLeft: "1px solid #2b2b2b",
                borderRight: "1px solid #2b2b2b",
              }}
            >
              {header}
            </div>
            <div
              style={{
                height: "100%",
                borderLeft: "1px solid #2b2b2b",
                borderRight: "1px solid #2b2b2b",
              }}
            >
              {children}
            </div>
          </Col>
          {rightContent && (
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              {rightContent}
            </Col>
          )}
        </Row>
      </Layout>
    </div>
  );
};

export default Page;
