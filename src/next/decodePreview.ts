import { decode } from 'blurhash';
import * as ThumbHash from 'thumbhash';

export function decodePreview(
  hash: string,
  alpha: boolean = false,
  width = 100,
  height = 100
) {
  if (alpha) {
    return ThumbHash.thumbHashToDataURL(base64ToBinary(hash));
  } else {
    return blurHashToDataURL(hash, width, height);
  }
}

function base64ToBinary(base64: string) {
  return new Uint8Array(
    atob(base64)
      .split('')
      .map((x) => x.charCodeAt(0))
  );
}

function blurHashToDataURL(
  hash: string | undefined,
  width: number = 100,
  height: number = 100
): string | undefined {
  if (!hash) return undefined;

  const pixels = decode(hash, width, height);
  const dataURL = parsePixels(pixels, width, height);
  return dataURL;
}

// thanks to https://github.com/wheany/js-png-encoder
function parsePixels(pixels: Uint8ClampedArray, width: number, height: number) {
  const pixelsString = [...pixels]
    .map((byte) => String.fromCharCode(byte))
    .join('');
  const pngString = generatePng(width, height, pixelsString);
  const dataURL =
    typeof Buffer !== 'undefined'
      ? Buffer.from(getPngArray(pngString)).toString('base64')
      : btoa(pngString);
  return 'data:image/png;base64,' + dataURL;
}

function getPngArray(pngString: string) {
  const pngArray = new Uint8Array(pngString.length);
  for (let i = 0; i < pngString.length; i++) {
    pngArray[i] = pngString.charCodeAt(i);
  }
  return pngArray;
}

function generatePng(width: number, height: number, rgbaString: string) {
  const DEFLATE_METHOD = String.fromCharCode(0x78, 0x01);
  const CRC_TABLE: number[] = [];
  const SIGNATURE = String.fromCharCode(137, 80, 78, 71, 13, 10, 26, 10);
  const NO_FILTER = String.fromCharCode(0);

  let n, c, k;

  // make crc table
  for (n = 0; n < 256; n++) {
    c = n;
    for (k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    CRC_TABLE[n] = c;
  }

  // Functions
  function inflateStore(data: string) {
    const MAX_STORE_LENGTH = 65535;
    let storeBuffer = '';
    let remaining;
    let blockType;

    for (let i = 0; i < data.length; i += MAX_STORE_LENGTH) {
      remaining = data.length - i;
      blockType = '';

      if (remaining <= MAX_STORE_LENGTH) {
        blockType = String.fromCharCode(0x01);
      } else {
        remaining = MAX_STORE_LENGTH;
        blockType = String.fromCharCode(0x00);
      }
      // little-endian
      storeBuffer +=
        blockType +
        String.fromCharCode(remaining & 0xff, (remaining & 0xff00) >>> 8);
      storeBuffer += String.fromCharCode(
        ~remaining & 0xff,
        (~remaining & 0xff00) >>> 8
      );

      storeBuffer += data.substring(i, i + remaining);
    }

    return storeBuffer;
  }

  function adler32(data: string) {
    let MOD_ADLER = 65521;
    let a = 1;
    let b = 0;

    for (let i = 0; i < data.length; i++) {
      a = (a + data.charCodeAt(i)) % MOD_ADLER;
      b = (b + a) % MOD_ADLER;
    }

    return (b << 16) | a;
  }

  function updateCrc(crc: number, buf: string) {
    let c = crc;
    let b: number;

    for (let n = 0; n < buf.length; n++) {
      b = buf.charCodeAt(n);
      c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
    }
    return c;
  }

  function crc(buf: string) {
    return updateCrc(0xffffffff, buf) ^ 0xffffffff;
  }

  function dwordAsString(dword: number) {
    return String.fromCharCode(
      (dword & 0xff000000) >>> 24,
      (dword & 0x00ff0000) >>> 16,
      (dword & 0x0000ff00) >>> 8,
      dword & 0x000000ff
    );
  }

  function createChunk(length: number, type: string, data: string) {
    const CRC = crc(type + data);

    return dwordAsString(length) + type + data + dwordAsString(CRC);
  }

  function createIHDR(width: number, height: number) {
    const IHDRdata =
      dwordAsString(width) +
      dwordAsString(height) +
      // bit depth
      String.fromCharCode(8) +
      // color type: 6=truecolor with alpha
      String.fromCharCode(6) +
      // compression method: 0=deflate, only allowed value
      String.fromCharCode(0) +
      // filtering: 0=adaptive, only allowed value
      String.fromCharCode(0) +
      // interlacing: 0=none
      String.fromCharCode(0);

    return createChunk(13, 'IHDR', IHDRdata);
  }

  // PNG creations

  const IEND = createChunk(0, 'IEND', '');
  const IHDR = createIHDR(width, height);

  let scanlines = '';
  let scanline;

  for (let y = 0; y < rgbaString.length; y += width * 4) {
    scanline = NO_FILTER;
    if (Array.isArray(rgbaString)) {
      for (let x = 0; x < width * 4; x++) {
        scanline += String.fromCharCode(rgbaString[y + x] & 0xff);
      }
    } else {
      scanline += rgbaString.substr(y, width * 4);
    }
    scanlines += scanline;
  }

  const compressedScanlines =
    DEFLATE_METHOD +
    inflateStore(scanlines) +
    dwordAsString(adler32(scanlines));
  const IDAT = createChunk(
    compressedScanlines.length,
    'IDAT',
    compressedScanlines
  );

  const pngString = SIGNATURE + IHDR + IDAT + IEND;
  return pngString;
}
