var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  PolyAES: () => PolyAES,
  PolyBcrypt: () => PolyBcrypt_default,
  PolyDigest: () => PolyDigest_default,
  PolyRand: () => PolyRand_default
});
module.exports = __toCommonJS(src_exports);

// src/PolyAES.ts
var import_util = __toESM(require("node-forge/lib/util"), 1);
var import_pbkdf2 = __toESM(require("node-forge/lib/pbkdf2"), 1);
var import_random = __toESM(require("node-forge/lib/random"), 1);
var import_cipher = __toESM(require("node-forge/lib/cipher"), 1);
var _PolyAES = class {
  _key;
  _encoding;
  static withKey(hexKey) {
    if (!/^[A-F0-9]{64}$/i.test(hexKey)) {
      throw new Error(_PolyAES.KEY_FORMAT_ERROR);
    }
    const binKey = import_util.default.hexToBytes(hexKey);
    return new _PolyAES(binKey);
  }
  static withPassword(password, salt, numIterations = 1e4) {
    if (String(salt).length < 8) {
      throw new Error(_PolyAES.SALT_SIZE_ERROR);
    }
    const bytes = 32;
    const binKey = (0, import_pbkdf2.default)(password, salt, numIterations, bytes);
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
      return import_util.default.encode64(bin);
    } else if (this._encoding === "hex") {
      return import_util.default.bytesToHex(bin);
    }
  }
  _strToBin(str) {
    if (this._encoding === "bin") {
      return str;
    } else if (this._encoding === "base64") {
      return import_util.default.decode64(str);
    } else if (this._encoding === "hex") {
      return import_util.default.hexToBytes(str);
    }
  }
  encrypt(data) {
    const mode = "AES-GCM";
    const iv = import_random.default.getBytesSync(128 / 8);
    const ciph = import_cipher.default.createCipher(mode, this._key);
    ciph.start({ iv, tagLength: 128 });
    ciph.update(import_util.default.createBuffer(this._utf8ToBin(data)));
    ciph.finish();
    return this._binToStr(iv + ciph.mode.tag.data + ciph.output.data);
  }
  decrypt(data) {
    const mode = "AES-GCM";
    const bytes = this._strToBin(data);
    const iv = bytes.slice(0, 16);
    const tag = bytes.slice(16, 32);
    const ciphertext = bytes.slice(32);
    const decipher = import_cipher.default.createDecipher(mode, this._key);
    decipher.start({ iv, tag });
    decipher.update(import_util.default.createBuffer(ciphertext));
    const ok = decipher.finish();
    return ok ? this._binToUtf8(decipher.output.data) : false;
  }
  static generateKey(length = 64) {
    return import_util.default.bytesToHex(import_random.default.getBytesSync(length / 2));
  }
  static generateSalt(length = 64) {
    return import_util.default.bytesToHex(import_random.default.getBytesSync(length / 2));
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
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
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
    const salt = import_bcryptjs.default.genSaltSync(cost);
    return import_bcryptjs.default.hashSync(password, salt);
  },
  verify(password, hash) {
    if (password.length > 72) {
      return false;
    }
    return import_bcryptjs.default.compareSync(password, hash);
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
var import_md = __toESM(require("node-forge/lib/md.all"), 1);
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
    const hash = import_md.default[algo].create();
    hash.update(data);
    return hash.digest().toHex();
  }
};
var PolyDigest_default = PolyDigest;

// src/PolyRand.ts
var import_util2 = __toESM(require("node-forge/lib/util"), 1);
var import_random2 = __toESM(require("node-forge/lib/random"), 1);
var PolyRand = {
  SYMBOL_LIST_ERROR: "PolyRand: Symbol list must contain between 2 and 256 characters.",
  SLUG_SYMBOL_LIST: "0123456789bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ".split(""),
  FAX_SYMBOL_LIST: "3467bcdfhjkmnpqrtvwxy".split(""),
  bytes(length) {
    return import_random2.default.getBytesSync(length);
  },
  hex(length) {
    return import_util2.default.bytesToHex(PolyRand.bytes(length / 2));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PolyAES,
  PolyBcrypt,
  PolyDigest,
  PolyRand
});
