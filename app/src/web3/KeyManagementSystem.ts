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
    const payload=atob(data.split('.')[1])
    const signature = await web3Provider.getSigner().signMessage(JSON.stringify(JSON.parse(payload),null, 2))
    return 'WEB3' + signature

  }
}
