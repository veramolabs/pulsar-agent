import { IAgent, IMessageHandler, TAgent, IDataStore } from '@veramo/core'
import { text, Request, Router } from 'express'
const path = require('path')

interface RequestWithMessageHandler extends Request {
  agent?: TAgent<IMessageHandler & IDataStore>
}


/**
 * Creates a router for handling incoming messages
 *
 * @param options - Initialization option
 * @returns Expressjs router
 */
export const SpaRouter = (): Router => {
  const router = Router()
  router.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../app/build/', 'index.html'))
  })

  return router
}
