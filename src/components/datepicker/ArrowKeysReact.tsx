// Based on: https://github.com/leon-good-life/arrow-keys-react
// re-implemented by @hexelon in https://github.com/hexelon/chakra-dayzed-datepicker/commit/4f44e565e3975f613b54304d1fdaeb97dd7dfa15

import type { KeyboardEvent } from 'react';

interface ArrowKeysReactConfig {
  left?: () => void;
  right?: () => void;
  up?: () => void;
  down?: () => void;
}

export class ArrowKeysReact {
  config: ArrowKeysReactConfig;

  constructor(config: ArrowKeysReactConfig) {
    this.config = config;
  }

  getEvents(): { onKeyDown: (e: KeyboardEvent) => void } {
    return {
      onKeyDown: (e: KeyboardEvent): void => {
        switch (e.key) {
          case 'ArrowDown':
            this.config.down?.();
            break;
          case 'ArrowLeft':
            this.config.left?.();
            break;
          case 'ArrowRight':
            this.config.right?.();
            break;
          case 'ArrowUp':
            this.config.up?.();
            break;
        }
      },
    };
  }
}
