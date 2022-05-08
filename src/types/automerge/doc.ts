import Automerge from 'automerge';

export interface TextDoc {
  text: Automerge.Text;
}

export type Doc = Automerge.Doc<TextDoc>;
