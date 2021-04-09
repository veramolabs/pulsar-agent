import { parse } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

export function NFTResolver(config: any) {
  const resolve = getResolver(config).ethr

  return async function(did: string) {
    const split = did.split(':')
    const res = await (await fetch(`${process.env.REACT_APP_BASE_URL}/opensea/asset/${split[3]}/${split[4]}/`)).json()
    // throw nice OpenSea throttling message
    if (!('top_ownerships' in res)) {
      throw new Error('OpenSea API returned an unexpected result. Probably throttling.')
    }
    //FIXME
    const ethrDid = 'did:ethr:' + res.top_ownerships[0].owner.address
    const parsed = parse(ethrDid)
    if (parsed === null) throw Error('Cannot parse did')
    // @ts-ignore
    const didDoc = resolve(ethrDid, parsed, null, null)
    return didDoc
  }
}
