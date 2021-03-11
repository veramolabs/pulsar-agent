import {
  createAgent,
  IDIDManager,
  IKeyManager,
  IResolver,
} from '@veramo/core'
import { AgentRestClient } from '@veramo/remote-client'
import { ProfileManager } from './ProfileManager'

export function createClientAgent() {
  const id = 'clientAgent'

  const agent = createAgent<IDIDManager & IKeyManager & IResolver>({
    context: {
      id,
      name: `Client agent`,
    },
    plugins: [
      new ProfileManager(),
      new AgentRestClient({
        url: 'https://pulsar.veramo.io/public-agent',
        enabledMethods: [
          'resolveDid',
          'dataStoreGetMessage',
          'dataStoreGetVerifiableCredential',
          'dataStoreGetVerifiablePresentation',
          'dataStoreORMGetIdentifiers',
          'dataStoreORMGetIdentifiersCount',
          'dataStoreORMGetMessages',
          'dataStoreORMGetMessagesCount',
          'dataStoreORMGetVerifiableCredentialsByClaims',
          'dataStoreORMGetVerifiableCredentialsByClaimsCount',
          'dataStoreORMGetVerifiableCredentials',
          'dataStoreORMGetVerifiableCredentialsCount',
          'dataStoreORMGetVerifiablePresentations',
          'dataStoreORMGetVerifiablePresentationsCount',
        ],
      })
    ]
  })

  
  return agent
}
