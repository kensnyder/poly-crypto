var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/PolyAES.ts
import util from "node-forge/lib/util";
import pbkdf2 from "node-forge/lib/pbkdf2";
import random from "node-forge/lib/random";
import cipher from "node-forge/lib/cipher";
var _PolyAES = class {
  _key;
  _encoding;
  static withKey(hexKey) {
    if (!/^[A-F0-9]{64}$/i.test(hexKey)) {
      throw new Error(_PolyAES.KEY_FORMAT_ERROR);
    }
    const binKey = util.hexToBytes(hexKey);
    return new _PolyAES(binKey);
  }
  static withPassword(password, salt, numIterations = 1e4) {
    if (String(salt).length < 8) {
      throw new Error(_PolyAES.SALT_SIZE_ERROR);
    }
    const bytes = 32;
    const binKey = pbkdf2(password, salt, numIterations, bytes);
    return new _PolyAES(binKey);
  }
  constructor(binKey) {
    this._key = binKey;
    this.setEncoding(_PolyAES.DEFAULT_ENCODING);
  }
  setEncoding(encoding) {
    const allowed = ["base64", "hex", "bin"];
    if (allowed.indexOf(encoding) === -1) {
      throw new Error(_PolyAES.ENCODING_ERROR);
    }
    this._encoding = encoding;
    return this;
  }
  getEncoding() {
    return this._encoding;
  }
  _binToStr(bin) {
    if (this._encoding === "bin") {
      return bin;
    } else if (this._encoding === "base64") {
      return util.encode64(bin);
    } else if (this._encoding === "hex") {
      return util.bytesToHex(bin);
    }
  }
  _strToBin(str) {
    if (this._encoding === "bin") {
      return str;
    } else if (this._encoding === "base64") {
      return util.decode64(str);
    } else if (this._encoding === "hex") {
      return util.hexToBytes(str);
    }
  }
  encrypt(data) {
    const mode = "AES-GCM";
    const iv = random.getBytesSync(128 / 8);
    const ciph = cipher.createCipher(mode, this._key);
    ciph.start({ iv, tagLength: 128 });
    ciph.update(util.createBuffer(this._utf8ToBin(data)));
    ciph.finish();
    return this._binToStr(iv + ciph.mode.tag.data + ciph.output.data);
  }
  decrypt(data) {
    const mode = "AES-GCM";
    const bytes = this._strToBin(data);
    const iv = bytes.slice(0, 16);
    const tag = bytes.slice(16, 32);
    const ciphertext = bytes.slice(32);
    const decipher = cipher.createDecipher(mode, this._key);
    decipher.start({ iv, tag });
    decipher.update(util.createBuffer(ciphertext));
    const ok = decipher.finish();
    return ok ? this._binToUtf8(decipher.output.data) : false;
  }
  static generateKey(length = 64) {
    return util.bytesToHex(random.getBytesSync(length / 2));
  }
  static generateSalt(length = 64) {
    return util.bytesToHex(random.getBytesSync(length / 2));
  }
  _utf8ToBin(data) {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(data, "utf8").toString("binary");
    } else if (typeof TextEncoder !== "undefined") {
      const encoder = new TextEncoder();
      const buf = encoder.encode(data);
      let bin = "";
      buf.forEach(function(i) {
        bin += String.fromCharCode(i);
      });
      return bin;
    } else {
      const escstr = encodeURIComponent(data);
      const bin = escstr.replace(/%([0-9A-F]{2})/gi, function($0, hex) {
        return String.fromCharCode(parseInt(hex, 16));
      });
      return bin;
    }
  }
  _binToUtf8(data) {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(data, "binary").toString("utf8");
    } else if (typeof TextDecoder !== "undefined" && typeof Uint8Array !== "undefined") {
      const decoder = new TextDecoder("utf-8");
      const arr = [];
      data.split("").forEach(function(c) {
        arr.push(c.charCodeAt(0));
      });
      return decoder.decode(Uint8Array.from(arr));
    } else {
      const escstr = data.replace(/./g, function(char) {
        let code = char.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) {
          code = "0" + code;
        }
        return "%" + code;
      });
      return decodeURIComponent(escstr);
    }
  }
};
var PolyAES = _PolyAES;
__publicField(PolyAES, "KEY_FORMAT_ERROR", "PolyAES: key must be 64-character hexadecimal string.");
__publicField(PolyAES, "SALT_SIZE_ERROR", "PolyAES: salt must be 8+ characters.");
__publicField(PolyAES, "ENCODING_ERROR", "PolyAES: encoding must be base64, hex, or bin.");
__publicField(PolyAES, "DEFAULT_ENCODING", "base64");

// src/PolyBcrypt.ts
import bcrypt from "bcryptjs";
var PolyBcrypt = {
  LENGTH_ERROR: "PolyBcrypt: password must be 72 bytes or less",
  COST_ERROR: "PolyBcrypt: cost must be between 4 and 31",
  hash(password, cost = 13) {
    if (password.length > 72) {
      throw Error(PolyBcrypt.LENGTH_ERROR);
    }
    cost = Number(cost);
    if (isNaN(cost) || cost < 4 || cost > 31) {
      throw Error(PolyBcrypt.COST_ERROR);
    }
    const salt = bcrypt.genSaltSync(cost);
    return bcrypt.hashSync(password, salt);
  },
  verify(password, hash) {
    if (password.length > 72) {
      return false;
    }
    return bcrypt.compareSync(password, hash);
  },
  info(hash) {
    const match = String(hash).match(/^(\$..?\$)(\d\d)\$(.{22})(.{31})$/);
    if (!match) {
      return {
        valid: false
      };
    }
    return {
      valid: true,
      version: match[1],
      cost: parseInt(match[2], 10),
      salt: match[3],
      hash: match[4]
    };
  }
};
var PolyBcrypt_default = PolyBcrypt;

// src/PolyDigest.ts
import md from "node-forge/lib/md.all";
var PolyDigest = {
  md5(data) {
    return PolyDigest._digest("md5", data);
  },
  sha1(data) {
    return PolyDigest._digest("sha1", data);
  },
  sha256(data) {
    return PolyDigest._digest("sha256", data);
  },
  sha512(data) {
    return PolyDigest._digest("sha512", data);
  },
  _digest(algo, data) {
    const hash = md[algo].create();
    hash.update(data);
    return hash.digest().toHex();
  }
};
var PolyDigest_default = PolyDigest;

// src/PolyRand.ts
import util2 from "node-forge/lib/util";
import random2 from "node-forge/lib/random";
var PolyRand = {
  SYMBOL_LIST_ERROR: "PolyRand: Symbol list must contain between 2 and 256 characters.",
  SLUG_SYMBOL_LIST: "0123456789bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ".split(""),
  FAX_SYMBOL_LIST: "3467bcdfhjkmnpqrtvwxy".split(""),
  bytes(length) {
    return random2.getBytesSync(length);
  },
  hex(length) {
    return util2.bytesToHex(PolyRand.bytes(length / 2));
  },
  slug(length) {
    return PolyRand.string(length, PolyRand.SLUG_SYMBOL_LIST);
  },
  fax(length) {
    return PolyRand.string(length, PolyRand.FAX_SYMBOL_LIST);
  },
  string(length, symbolList) {
    const randomBytes = PolyRand.bytes(length);
    if (!Array.isArray(symbolList) || symbolList.length < 2 || symbolList.length > 256) {
      throw new Error(PolyRand.SYMBOL_LIST_ERROR);
    }
    let numSymbols = symbolList.length;
    let output = "";
    for (let i = 0; i < length; i++) {
      let ord = randomBytes.charCodeAt(i);
      output += symbolList[ord % numSymbols];
    }
    return output;
  }
};
var PolyRand_default = PolyRand;
export {
  PolyAES,
  PolyBcrypt_default as PolyBcrypt,
  PolyDigest_default as PolyDigest,
  PolyRand_default as PolyRand
};
