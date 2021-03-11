import React from 'react'
import { Avatar, Card, List } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { formatDistanceToNow } from 'date-fns'

import PostForm from './PostForm'
import { Web3 } from './web3/Web3'
const Credentials = () => {

  const { getAgent } = useVeramo()

  const agent = getAgent('clientAgent')

  let web3Agent
  try {
    web3Agent = getAgent('web3Agent')
  } catch (e) {}
  
  const { data: credentials } = useQuery(
    ['credentials', { agentId: agent?.context.name }],
    () => agent?.dataStoreORMGetVerifiableCredentials({
      where: [
        { column: 'type', value: ['VerifiableCredential,VerifiableSocialPosting'] }
      ],
      order: [
        {column: 'issuanceDate', direction: 'DESC'}
      ]
    }),
  )

  return (
    <>
      {web3Agent !== undefined && <Card><PostForm /></Card>}
      {web3Agent === undefined && <Card title='Login'><Web3 /></Card>}
      
      <Card>

      
      <List
        itemLayout="horizontal"
        dataSource={credentials}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.verifiableCredential.credentialSubject.author?.image} size='large'/>}
              title={<a href={'/credential/' + item.hash}>{item.verifiableCredential.credentialSubject.author?.name}</a>}
              description={`${formatDistanceToNow(Date.parse(item.verifiableCredential.issuanceDate),)} ago`}
              />
              {item.verifiableCredential.credentialSubject?.articleBody}
          </List.Item>
        )}
        />
        </Card>
    </>
  )
}

export default Credentials
