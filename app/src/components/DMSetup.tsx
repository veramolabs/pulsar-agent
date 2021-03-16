import React, { useEffect, useState } from 'react'
import { Typography, Form, Input, Button, List, notification, Card } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager, IResolver, TAgent } from '@veramo/core'


interface FormValues {
  endpoint: string
}

const DMSetup = () => {
  const [messagingEndpoint, setMessagingEndpoint ] = useState<string | undefined>(undefined)
  const [owner, setOwner ] = useState<string | undefined>(undefined)

  const { getAgent } = useVeramo()

  let agent: TAgent<IDIDManager & IResolver> | undefined

  try {
    agent = getAgent("web3Agent");
  } catch (e) {}

  useEffect(() => {

    if (agent) {
      agent.didManagerGetByAlias({alias: 'owner'})
      .then(owner => {
        setOwner(owner.did)
        return owner
      })
      .then(({did}) => agent?.resolveDid({ didUrl: did }))
      .then((didDoc) => {
        const service = didDoc?.service?.find((s) => s.type === 'Messaging')
        if (service) {
          setMessagingEndpoint(service.serviceEndpoint)
        }
      })
    }
  }, [agent])

  const initialValues: FormValues = {
    endpoint: '',
  }

  const addService = async (values: FormValues) => {

    try {
      if (owner && values.endpoint) {
        await agent?.didManagerAddService({
          did: owner,
          service: {
            id: 'msg123',
            type: 'Messaging',
            serviceEndpoint: values.endpoint,
            description: '',
          },
        })
        notification.success({message: 'Direct messages enabled'})
      }
    } catch (error) {
      notification.error({message: 'Failed'})
    }
  }

  if (messagingEndpoint) {
    return (
      <Card>Your messages are handled by: {messagingEndpoint}</Card>
    )
  }

  return (
    <Card title='Enable direct messages'>

      <Form
        initialValues={initialValues}
        onFinish={addService}
        onFinishFailed={(e) => notification.error({message: 'Failed'})}
      >
        <Form.Item
          label="Endpoint"
          name="endpoint"
          rules={[{ required: true, message: 'Please input Endpoint!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          
        </Form.Item>
      </Form>

    </Card>
  )
}

export default DMSetup
