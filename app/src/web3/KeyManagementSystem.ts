import { Web3Provider } from '@ethersproject/providers'
import { TKeyType, IKey, EcdsaSignature } from '@veramo/core'
import { AbstractKeyManagementSystem } from '@veramo/key-manager'
import { providers } from 'ethers'
export class Web3KeyManagementSystem extends AbstractKeyManagementSystem {
  constructor(private provider: Promise<Web3Provider>) {
    super()
  }

  async createKey({ type }: { type: TKeyType }): Promise<Omit<IKey, 'kms'>> {
    throw Error('Not implemented')
  }

  async deleteKey(args: { kid: string }) {
    // this kms doesn't need to delete keys
    return true
  }

  async encryptJWE({
    key,
    to,
    data,
  }: {
    key: IKey
    to: IKey
    data: string
  }): Promise<string> {
    throw Error('Not implemented')
  }

  async decryptJWE({
    key,
    data,
  }: {
    key: IKey
    data: string
  }): Promise<string> {
    throw Error('Not implemented')
  }

  async signEthTX({
    key,
    transaction,
  }: {
    key: IKey
    transaction: object
  }): Promise<string> {
    throw Error('Not implemented')
    // this.provider.send
    // return sign(transaction, '0x' + key.privateKeyHex)
  }

  async signJWT({
    key,
    data,
  }: {
    key: IKey
    data: string
  }): Promise<EcdsaSignature | string> {
    const p = await this.provider as any
    const web3Provider = new providers.Web3Provider(p)

    //FIXME this is mock signature just to explain the concept
    // const payload=atob(data.split('.')[1])
    // const signature = await web3Provider.getSigner().signMessage(JSON.stringify(JSON.parse(payload),null, 2))
    // // 712
    // await web3Provider.send('eth_signTypedData_v4', {
    //   domain:
    // });
    //
    // await web3Provider.getSigner()._signTypedData()

    // @ts-ignore
    const signature = await web3Provider.getSigner()._signTypedData(this.getSampleDomain(), this.getEIP712Schema(), this.getSampleCredential())
    return 'WEB3' + signature

  }

  // @ts-ignore
  getSampleCredential() {
    return {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3id.org/veramolabs/socialmedia/context/v1"
      ],
      "type": [
        "VerifiableCredential",
        "VerifableSocialMediaPosting"
      ],
      "id": "https://example.org/post/1234",
      "issuer": "did:example:aadsfewfweasdfsfad",
      "issuanceDate": "2010-01-01T19:23:24Z",
      "credentialSubject": {
        // might contain reply tweet URL
        "id": "https://example.org/post/1234",
        "type": "SocialMediaPosting",
        "author": {
          "id": "did:nft:ebfeb1f712ebc6f1c276e12ec21",
          "type": "Person",
          "thumbnail": "https://google.com",
          "image": "https://google.com",
          "name": "cryptopunk"
        },
        "headline": "punks are aliens",
        "articleBody": "waffles for zoomers"
      },
      "credentialSchema": {
        "id": "https://www.w3id.org/veramolabs/socialmedia/context/v1/eip712.json",
        "type": "Eip712SchemaValidator2021"
      }
    };
  }

  getEIP712Schema() {
    return {
      VerifiableCredential: [
        { name: '@context', type: 'string[]' },
        { name: 'type', type: 'string[]' },
        { name: 'id', type: 'string' },
        { name: 'issuer', type: 'string' },
        { name: 'issuanceDate', type: 'string' },
        { name: 'credentialSubject', type: 'CredentialSubject' },
        { name: 'credentialSchema', type: 'CredentialSchema' }
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
        { name: 'type', type: 'string' },
        { name: 'id', type: 'string' },
        { name: 'thumbnail', type: 'string' },
        { name: 'image', type: 'string' },
        { name: 'name', type: 'string' }
      ]
    };
  }

  getSampleDomain() {
    return {
      name: 'Sign Tweet',
      version: '2',
      chainId: 4,
      salt: '0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558',
    }
  }
}
