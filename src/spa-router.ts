import { IAgent, IMessageHandler, TAgent, IDataStore } from '@veramo/core'
import { IDataStoreORM } from '@veramo/data-store'
import { text, Request, Router } from 'express'
import exphbs from 'express-handlebars'

const hbs = exphbs.create();
const path = require('path')

interface RequestWitDataStore extends Request {
  agent: TAgent<IDataStore & IDataStoreORM>
}


/**
 * Creates a router for handling incoming messages
 *
 * @param options - Initialization option
 * @returns Expressjs router
 */
export const SpaRouter = (): Router => {
  const router = Router()

  router.get('/post/:id', async function (req: RequestWitDataStore, res: any) {

    const credential = await req.agent?.dataStoreORMGetVerifiableCredentials({ where: [
      {column: 'id', value: [`${process.env.REACT_APP_BASE_URL}/post/${req.params.id}`]}
    ], take: 1 }).then(r => r[0].verifiableCredential)

    const html = await hbs.render(path.join(__dirname, '../app/build/', 'index.html'), { 
      title: credential.credentialSubject.author.name,
      description: credential.credentialSubject.articleBody,
      image: credential.credentialSubject.author.image,
     })
    res.send(html)
  })

  router.get('/*', async function (req, res) {
    const html = await hbs.render(path.join(__dirname, '../app/build/', 'index.html'), { 
      title: 'DID Shout - Built on Veramo!',
      description: 'DID Microblogging - Built on Veramo!',
      image: 'https://i.imgur.com/QEG6xMg.jpg',
     })
    res.send(html)
  })

  return router
}
