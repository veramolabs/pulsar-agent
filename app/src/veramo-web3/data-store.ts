import {
  IAgentPlugin,
  IDataStore,
  IDataStoreGetMessageArgs,
  IDataStoreGetVerifiableCredentialArgs,
  IDataStoreGetVerifiablePresentationArgs,
  IDataStoreSaveMessageArgs,
  IDataStoreSaveVerifiableCredentialArgs,
  IDataStoreSaveVerifiablePresentationArgs,
  IMessage,
  VerifiableCredential,
  VerifiablePresentation,
  schema,
} from '@veramo/core'

export class DataStore implements IAgentPlugin {
  readonly methods: IDataStore
  readonly schema = schema.IDataStore

  constructor() {

    this.methods = {
      dataStoreSaveMessage: this.dataStoreSaveMessage.bind(this),
      dataStoreGetMessage: this.dataStoreGetMessage.bind(this),
      dataStoreSaveVerifiableCredential: this.dataStoreSaveVerifiableCredential.bind(this),
      dataStoreGetVerifiableCredential: this.dataStoreGetVerifiableCredential.bind(this),
      dataStoreSaveVerifiablePresentation: this.dataStoreSaveVerifiablePresentation.bind(this),
      dataStoreGetVerifiablePresentation: this.dataStoreGetVerifiablePresentation.bind(this),
    }
  }

  async dataStoreSaveMessage(args: IDataStoreSaveMessageArgs): Promise<string> {
    return args.message.id
  }

  async dataStoreGetMessage(args: IDataStoreGetMessageArgs): Promise<IMessage> {
    throw Error('Not implemented')
  }

  async dataStoreSaveVerifiableCredential(args: IDataStoreSaveVerifiableCredentialArgs): Promise<string> {
    throw Error('Not implemented')
  }

  async dataStoreGetVerifiableCredential(
    args: IDataStoreGetVerifiableCredentialArgs,
  ): Promise<VerifiableCredential> {
    throw Error('Not implemented')

  }

  async dataStoreSaveVerifiablePresentation(args: IDataStoreSaveVerifiablePresentationArgs): Promise<string> {
    throw Error('Not implemented')

  }

  async dataStoreGetVerifiablePresentation(
    args: IDataStoreGetVerifiablePresentationArgs,
  ): Promise<VerifiablePresentation> {
    throw Error('Not implemented')

  }
}
