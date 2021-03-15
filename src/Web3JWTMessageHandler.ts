import { IAgentContext, IResolver } from '@veramo/core'
import { AbstractMessageHandler, Message } from '@veramo/message-handler'
import { decodeJWT } from 'did-jwt'
import { verifyTypedData } from '@ethersproject/wallet'

import { normalizeCredential } from 'did-jwt-vc'

export type IContext = IAgentContext<IResolver>

// DUPLICATED CODE
const getEIP712Schema = () => ({
  VerifiableCredential: [
    { name: '@context', type: 'string[]' },
    { name: 'type', type: 'string[]' },
    { name: 'id', type: 'string' },
    { name: 'issuer', type: 'Issuer' },
    { name: 'issuanceDate', type: 'string' },
    { name: 'credentialSubject', type: 'CredentialSubject' },
    { name: 'credentialSchema', type: 'CredentialSchema' }
  ],
  Issuer: [
    { name: 'id', type: 'string' }
  ],
  CredentialSchema: [
    { name: 'id', type: 'string' },
    { name: 'type', type: 'string' },
  ],
  CredentialSubject: [
    { name: 'type', type: 'string' },
    { name: 'id', type: 'string' },
    { name: 'headline', type: 'string' },
    { name: 'articleBody', type: 'string' },
    { name: 'author', type: 'Person' }
  ],
  Person: [
    // { name: 'type', type: 'string' },
    { name: 'id', type: 'string' },
    // { name: 'thumbnail', type: 'string' },
    { name: 'image', type: 'string' },
    { name: 'name', type: 'string' }
  ]
})

const getDomain = (activeChainId: number) => ({
  name: 'Sign Tweet',
  version: '1',
  chainId: activeChainId,
})

export class Web3JwtMessageHandler extends AbstractMessageHandler {
  async handle(message: Message, context: IContext): Promise<Message> {

    if (message.raw) {
      try {
        //FIXME this is mock signature verification just to explain the concept
        const decoded = decodeJWT(message.raw)
        if (decoded.signature.slice(0,4) === 'WEB3') {
          // print signature
          console.log(`Signature: ${decoded.signature.slice(4)}`)

          // Hacky payload transformation
          const w3c_vc = normalizeCredential(message.raw) as any
          // Fix signing output
          delete w3c_vc.proof

          console.log(JSON.stringify(w3c_vc))


          // Verify Typed Web3 Signature:
          const signingAddress = verifyTypedData(getDomain(1), getEIP712Schema(), w3c_vc, decoded.signature.slice(4))
          console.log(`Signing Address: ${signingAddress}`)

          if (`did:ethr:${signingAddress.toLowerCase()}` !== w3c_vc.issuer?.id?.toLowerCase()) {
            throw new Error(`Signed Message did not come from stated issuer ${w3c_vc.issuer?.id}`);
          }

          message.addMetaData({ type: decoded.header.typ || 'JWT', value: decoded.header.alg })
          message.data = decoded.payload
        }

      } catch (e) {
        console.log(e.message)
      }
    }

    return super.handle(message, context)
  }
}
