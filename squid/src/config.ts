import * as dotenv from "dotenv"
import {type RpcEndpointSettings} from '@subsquid/substrate-processor'

dotenv.config()

const config: {
  rpcEndpointSettings: RpcEndpointSettings
} = {
  rpcEndpointSettings: {
    url: process.env.NODE_RPC_ENDPOINT || "http://localhost:9944",
    capacity: 10,
    rateLimit: 10,
    requestTimeout: 30_000,
    maxBatchCallSize: 100,
  }
}

export default config
