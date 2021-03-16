import { IAgentContext, IResolver } from '@veramo/core'
import { AbstractMessageHandler, Message } from '@veramo/message-handler'
import { decodeJWT } from 'did-jwt'
import { verifyTypedData } from '@ethersproject/wallet'

import { DIDDocument } from 'did-resolver'
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

const checkSigningAddressInDidDoc = (signingAddress: string, didDoc: DIDDocument) => {
  // collect all ethereumAddress from didDoc.publicKey
  const ethereumAddresses = didDoc.publicKey.filter( x => 'ethereumAddress' in x && x.ethereumAddress).map(x => x.ethereumAddress?.toLowerCase())

  if (!ethereumAddresses.includes(signingAddress.toLowerCase())) {
    throw new Error(`Message was not signed by an ethereumAddress in ${didDoc.id}`)
  }
}

export class Web3JwtMessageHandler extends AbstractMessageHandler {
  async handle(message: Message, context: IContext): Promise<Message> {

    if (message.raw) {
      try {
        //FIXME this is mock signature verification just to explain the concept
        const decoded = decodeJWT(message.raw)
        if (decoded.signature.slice(0,4) === 'WEB3') {
          // Hacky payload transformation
          const w3c_vc = normalizeCredential(message.raw) as any
          // Fix signing output
          delete w3c_vc.proof

          // Verify Typed Web3 Signature:
          const signingAddress = verifyTypedData(getDomain(1), getEIP712Schema(), w3c_vc, decoded.signature.slice(4))

          // You need this for local development because of Opensea Rate limiting
          await new Promise(r => setTimeout(r, 1000));

          // Check SigningAddress against issuer did:
          const didUrl = w3c_vc.issuer?.id?.toLowerCase()
          const didDoc = await context.agent.resolveDid( { didUrl } )

          // check signing Address
          checkSigningAddressInDidDoc(signingAddress, didDoc)

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
