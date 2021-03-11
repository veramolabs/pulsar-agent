import React from 'react'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IProfileManager } from './web3/ProfileManager'
import { Avatar } from 'antd'

interface Props {
  did: string
}

const Module: React.FC<Props> = ({
  did,
}) => {
  const { getAgent } = useVeramo<IProfileManager>()
  const agent = getAgent('clientAgent')
  const { data } = useQuery(
    ['profile' + did, { agentId: agent?.context.id }],
    () => agent?.getProfile({ did }),
    {
      enabled: !!did,
      initialData: {
        did: did,
        name: did,
        nickname: did,
        picture: '',
      }
    },
  )

  return (

    <div className="demo-option-label-item">
      <Avatar src={data?.picture} />
      {data?.name}
    </div>
  )
}

export default Module
