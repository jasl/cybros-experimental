import * as ss58 from "@subsquid/ss58"

import {hexToBytes as _hexToBytes} from "@noble/hashes/utils"

export const ss58Prefix = 42;

export function decodeSS58Address(bytes: Uint8Array) {
  return ss58.codec(ss58Prefix).encode(bytes)
}

export function hexToBytes(hex: string): Uint8Array {
  if (hex.startsWith("0x")) {
    return _hexToBytes(hex.slice(2));
  } else {
    return hexToBytes(hex);
  }
}

export function hexToString(hex: string): string {
  return (new TextDecoder()).decode(hexToBytes(hex));
}

export function* splitIntoBatches<T>(
  list: T[],
  maxBatchSize: number
): Generator<T[]> {
  if (list.length <= maxBatchSize) {
    yield list;
  } else {
    let offset = 0;
    while (list.length - offset > maxBatchSize) {
      yield list.slice(offset, offset + maxBatchSize);
      offset += maxBatchSize;
    }
    yield list.slice(offset);
  }
}
