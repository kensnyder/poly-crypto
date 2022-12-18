export type SupportedDigestAlgos = 'md5' | 'sha1' | 'sha256' | 'sha512';

export interface BcryptInfoInterface {
	valid: boolean;
	version?: string;
	cost?: number;
	salt?: string;
	hash?: string;
}

export type AesEncodings = 'base64' | 'hex' | 'bin';
