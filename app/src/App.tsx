import React from 'react';
import './App.less';
import { Row, Col } from 'antd'
import { Web3Provider } from '@ethersproject/providers'
import { VeramoWeb3Provider } from './web3/VeramoWeb3Provider'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Web3ReactProvider } from '@web3-react/core'
import SocialPosts from './SocialPosts'

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <VeramoWeb3Provider>
          <Row>
            <Col xs={2} sm={4} md={6} lg={8} >

            </Col>
            <Col xs={20} sm={16} md={12} lg={8}>
              <SocialPosts />
            </Col>
            <Col xs={2} sm={4} md={6} lg={8}>
            </Col>
          </Row>
        </VeramoWeb3Provider>
      </Web3ReactProvider>
    </QueryClientProvider>
  );
}

export default App;
