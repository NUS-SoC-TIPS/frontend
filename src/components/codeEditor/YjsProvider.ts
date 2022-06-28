import * as decoding from 'lib0/decoding';
import * as encoding from 'lib0/encoding';
import { Observable } from 'lib0/observable';
import { Socket } from 'socket.io-client';
import * as authProtocol from 'y-protocols/auth';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as syncProtocol from 'y-protocols/sync';
import { Doc } from 'yjs';

import { CODE_EVENTS, GENERAL_EVENTS } from 'constants/events';

const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;
const MESSAGE_AUTH = 2;
const MESSAGE_QUERY_AWARENESS = 3;

export class YjsProvider extends Observable<string> {
  public awareness: awarenessProtocol.Awareness;
  public _synced = false;
  public _handleDocUpdate: (update: Uint8Array, origin: YjsProvider) => void;
  public _handleAwarenessUpdate: (
    update: { added: number[]; updated: number[]; removed: number[] },
    origin: YjsProvider,
  ) => void;
  public _handleUnload: () => void;

  constructor(public socket: Socket, public doc: Doc) {
    super();
    this.awareness = new awarenessProtocol.Awareness(this.doc);

    // Configure event handlers
    this._handleDocUpdate = (update, origin): void => {
      if (origin !== this) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MESSAGE_SYNC);
        syncProtocol.writeUpdate(encoder, update);
        this.socket.emit(
          CODE_EVENTS.UPDATE_YJS,
          encoding.toUint8Array(encoder),
        );
      }
    };
    this.doc.on('update', this._handleDocUpdate);

    this._handleAwarenessUpdate = (
      { added, updated, removed },
      _origin,
    ): void => {
      const changedClients = added.concat(updated).concat(removed);
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, MESSAGE_AWARENESS);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients),
      );
      this.socket.emit(CODE_EVENTS.UPDATE_YJS, encoding.toUint8Array(encoder));
    };
    this.awareness.on('update', this._handleAwarenessUpdate);

    this._handleUnload = (): void => {
      awarenessProtocol.removeAwarenessStates(
        this.awareness,
        [this.doc.clientID],
        'window unload',
      );
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this._handleUnload);
    } else if (typeof process !== 'undefined') {
      process.on('exit', this._handleUnload);
    }

    this.connect();
  }

  get synced(): boolean {
    return this._synced;
  }

  set synced(state) {
    if (this._synced !== state) {
      this._synced = state;
      this.emit('synced', [state]);
      this.emit('sync', [state]);
    }
  }

  // Our passed in socket should already be connected + have a room associated with it on the backend.
  // Here, we'll just set up the listeners.
  connect(): void {
    this.socket.on(CODE_EVENTS.UPDATE_YJS, (data) => {
      const encoder = this.readMessage(new Uint8Array(data));
      if (encoding.length(encoder) > 1) {
        this.socket.emit(
          CODE_EVENTS.UPDATE_YJS,
          encoding.toUint8Array(encoder),
        );
      }
    });

    // So far, this is the only place where the disconnect event is handled.
    this.socket.on(GENERAL_EVENTS.DISCONNECT, (data) => {
      this.emit('connection-close', [data, this]);
      this.synced = false;
      awarenessProtocol.removeAwarenessStates(
        this.awareness,
        Array.from(this.awareness.getStates().keys()).filter(
          (client) => client !== this.doc.clientID,
        ),
        this,
      );
      this.emit('status', [{ status: 'disconnected' }]);

      // TODO: Come up with better error handling or some exponential backoff to retry connection
    });

    this.socket.on(GENERAL_EVENTS.CONNECT_ERROR, (data) =>
      this.emit('connection-error', [data, this]),
    );
    this.socket.on(GENERAL_EVENTS.CONNECT_FAILED, (data) =>
      this.emit('connection-error', [data, this]),
    );

    this.socket.on(CODE_EVENTS.CONNECT_YJS, () => {
      this.emit('status', [{ status: 'connected' }]);
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, MESSAGE_SYNC);
      syncProtocol.writeSyncStep1(encoder, this.doc);
      this.socket.emit(CODE_EVENTS.UPDATE_YJS, encoding.toUint8Array(encoder));
      if (this.awareness.getLocalState() !== null) {
        const encoderAwarenessState = encoding.createEncoder();
        encoding.writeVarUint(encoderAwarenessState, MESSAGE_AWARENESS);
        encoding.writeVarUint8Array(
          encoderAwarenessState,
          awarenessProtocol.encodeAwarenessUpdate(this.awareness, [
            this.doc.clientID,
          ]),
        );
        this.socket.emit(
          CODE_EVENTS.UPDATE_YJS,
          encoding.toUint8Array(encoderAwarenessState),
        );
      }
    });

    this.emit('status', [{ status: 'connecting' }]);
    this.socket.emit(CODE_EVENTS.CONNECT_YJS);
  }

  // Similar to connect, the socket disconnection will be handled by the room useEffect clean-up.
  // We just handle the events here.
  disconnect(): void {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MESSAGE_AWARENESS);
    encoding.writeVarUint8Array(
      encoder,
      awarenessProtocol.encodeAwarenessUpdate(
        this.awareness,
        [this.doc.clientID],
        new Map(),
      ),
    );
    this.socket.emit(CODE_EVENTS.UPDATE_YJS, encoding.toUint8Array(encoder));
  }

  override destroy(): void {
    this.disconnect();
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this._handleUnload);
    } else if (typeof process !== 'undefined') {
      process.off('exit', this._handleUnload);
    }
    this.awareness.off('update', this._handleAwarenessUpdate);
    this.doc.off('update', this._handleDocUpdate);
    super.destroy();
  }

  readMessage(data: Uint8Array): encoding.Encoder {
    const decoder = decoding.createDecoder(data);
    const encoder = encoding.createEncoder();
    const messageType = decoding.readVarUint(decoder);

    switch (messageType) {
      case MESSAGE_SYNC:
        encoding.writeVarUint(encoder, MESSAGE_SYNC);
        // eslint-disable-next-line no-case-declarations
        const syncMessageType = syncProtocol.readSyncMessage(
          decoder,
          encoder,
          this.doc,
          this,
        );
        if (
          syncMessageType === syncProtocol.messageYjsSyncStep2 &&
          !this.synced
        ) {
          this.synced = true;
        }
        break;

      case MESSAGE_AWARENESS:
        awarenessProtocol.applyAwarenessUpdate(
          this.awareness,
          decoding.readVarUint8Array(decoder),
          this,
        );
        break;

      case MESSAGE_AUTH:
        authProtocol.readAuthMessage(decoder, this.doc, (_provider, reason) =>
          // eslint-disable-next-line no-console
          console.error(`Permission denied.\n${reason}`),
        );
        break;

      case MESSAGE_QUERY_AWARENESS:
        encoding.writeVarUint(encoder, MESSAGE_AWARENESS);
        encoding.writeVarUint8Array(
          encoder,
          awarenessProtocol.encodeAwarenessUpdate(
            this.awareness,
            Array.from(this.awareness.getStates().keys()),
          ),
        );
        break;
    }
    return encoder;
  }
}
