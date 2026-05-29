import type Compressor from "./base";
import type Client from "../../Client";
import { DependencyError } from "../../util/Errors";
import type Shard from "../Shard";
import path from "node:path";
import zlib from "node:zlib";

export type CompressionType = "zlib-stream" | "zstd-stream";
export type CompressionLibrary = "native" | "zlib-sync" | "pako" | "zstd-napi";
export interface CompressionModule { default: new(shard: Shard) => Compressor; }
export interface CompressionConfig {
    name: CompressionLibrary;
    check(client: Client): boolean;
    getClass(): new(shard: Shard) => Compressor;
    getError(): DependencyError;
}

/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires, unicorn/prefer-module */
const CompressionConfigs: Record<string, Array<CompressionConfig>> = {
    "zlib-stream": [
        {
            name:     "zlib-sync",
            check:    (client: Client) => client.util._isModuleInstalled("zlib-sync"),
            getClass: () => (require(path.join(__dirname, "zlib-sync")) as CompressionModule).default,
            getError: () => new DependencyError("zlib-sync based zlib-stream compression is not available: zlib-sync is not installed")
        },
        {
            name:     "pako",
            check:    (client: Client) => client.util._isModuleInstalled("pako"),
            getClass: () => (require(path.join(__dirname, "pako")) as CompressionModule).default,
            getError: () => new DependencyError("pako based zlib-stream compression is not available: pako is not installed")
        },
        {
            name:     "native",
            check:    (_client: Client) => "createInflate" in zlib,
            getClass: () => (require(path.join(__dirname, "zlib-native")) as CompressionModule).default,
            getError: () => new DependencyError("native zlib-stream compression is not available: zlib.createInflate does not exist")
        }
    ],
    "zstd-stream": [
        {
            name:     "zstd-napi",
            check:    (client: Client) => client.util._isModuleInstalled("zstd-napi"),
            getClass: () => (require(path.join(__dirname, "zstd-napi")) as CompressionModule).default,
            getError: () => new DependencyError("zstd-napi based zstd-stream compression is not available: zstd-napi is not installed")
        },
        {
            name:     "native",
            check:    (_client: Client) => "createZstdDecompress" in zlib,
            getClass: () => (require(path.join(__dirname, "zstd-native")) as CompressionModule).default,
            getError: () => new DependencyError("native zstd-stream compression is not available: zlib.createZstdDecompress does not exist")
        }
    ]
};
/* eslint-enable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars */

export default CompressionConfigs;
