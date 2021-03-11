import React from 'react';
import './App.less';
import { Row, Col } from 'antd'

function App() {
  return (
    <>
      <Row>
        <Col xs={2} sm={4} md={6} lg={8} >

        </Col>
        <Col xs={20} sm={16} md={12} lg={8}>
          Center column
        </Col>
        <Col xs={2} sm={4} md={6} lg={8}>
        </Col>
      </Row>
    </>
  );
}

export default App;
