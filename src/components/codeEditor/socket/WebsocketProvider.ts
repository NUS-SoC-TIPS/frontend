import * as awarenessProtocol from 'y-protocols/awareness'
import { Observable } from 'lib0/observable';
import { Socket } from 'socket.io-client';
import { Doc } from 'yjs';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as syncProtocol from 'y-protocols/sync';
import * as authProtocol from 'y-protocols/auth'

const permissionDeniedHandler = (_provider: WebsocketProvider, reason: string) => console.warn(`Permission denied to access socket.\n${reason}`)

const messageSync = 0;
const messageQueryAwareness = 3;
const messageAwareness = 1;
const messageAuth = 2;

type MessageHandler = (encoder: encoding.Encoder, decoder: decoding.Decoder, provider: WebsocketProvider, emitSynced: boolean, messageType: number) => void;

const messageHandlers: MessageHandler[] = [];

messageHandlers[messageSync] = (
  encoder,
  decoder,
  provider,
  emitSynced,
  messageType,
) => {
  encoding.writeVarUint(encoder, messageSync);
  const syncMessageType = syncProtocol.readSyncMessage(
    decoder,
    encoder,
    provider.doc,
    provider,
  );
  if (
    emitSynced &&
    syncMessageType === syncProtocol.messageYjsSyncStep2 &&
    !provider.synced
  ) {
    provider.synced = true;
  }
};

messageHandlers[messageQueryAwareness] = (encoder, decoder, provider, emitSynced, messageType) => {
  encoding.writeVarUint(encoder, messageAwareness)
  encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(provider.awareness, Array.from(provider.awareness.getStates().keys())))
}

messageHandlers[messageAwareness] = (encoder, decoder, provider, emitSynced, messageType) => {
  awarenessProtocol.applyAwarenessUpdate(provider.awareness, decoding.readVarUint8Array(decoder), provider)
}

messageHandlers[messageAuth] = (encoder, decoder, provider, emitSynced, messageType) => {
  authProtocol.readAuthMessage(decoder, provider.doc, permissionDeniedHandler)
}


// TODO: Add handling for disconnections, reconnections, etc.
export class WebsocketProvider extends Observable<string> {
  private socket: Socket;
  doc: Doc;
  awareness: awarenessProtocol.Awareness;

    /**
   * @param {Socket} socket
   * @param {Doc} doc
   * @param {object} [opts]
   * @param {boolean} [opts.connect]
   * @param {awarenessProtocol.Awareness} [opts.awareness]
   * @param {number} [opts.resyncInterval] Request server state every `resyncInterval` milliseconds
   * @param {boolean} [opts.disableBc] Disable cross-tab BroadcastChannel communication
   */
  constructor(socket: Socket, roomname: string, doc: Doc, {
    connect = true,
    awareness = new awarenessProtocol.Awareness(doc),
    WebSocketPolyfill = WebSocket,
    resyncInterval = -1,
    maxBackoffTime = 2500,
    disableBc = false
  } = {}) {
    super()
    this.socket = socket;
    this.doc = doc
    this.awareness = awareness
    this.messageHandlers = messageHandlers.slice()
    /**
     * @type {boolean}
     */
    this._synced = false
    /**
     * @type {WebSocket?}
     */
    this.ws = null
    this.wsLastMessageReceived = 0
    /**
     * Whether to connect to other peers or not
     * @type {boolean}
     */
    this.shouldConnect = connect

    /**
     * @type {number}
     */
    this._resyncInterval = 0
    if (resyncInterval > 0) {
      this._resyncInterval = /** @type {any} */ (setInterval(() => {
        if (this.ws) {
          // resend sync step 1
          const encoder = encoding.createEncoder()
          encoding.writeVarUint(encoder, messageSync)
          syncProtocol.writeSyncStep1(encoder, doc)
          this.ws.send(encoding.toUint8Array(encoder))
        }
      }, resyncInterval))
    }
}
