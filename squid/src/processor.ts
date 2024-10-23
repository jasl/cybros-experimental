import {
    BlockHeader,
    DataHandlerContext,
    SubstrateBatchProcessor,
    SubstrateBatchProcessorFields,
} from "@subsquid/substrate-processor"
import {Store} from '@subsquid/typeorm-store'

import config from "./config"
import * as events from "./types/events"

export const processor = new SubstrateBatchProcessor()
    .setRpcEndpoint(config.rpcEndpointSettings)
    .setFields({
        block: {
            timestamp: true
        },
        extrinsic: {
            error: true,
            success: true,
            hash: true
        },
        call: {
            origin: true,
            name: true,
            args: true
        },
        event: {
            name: true,
            args: true
        }
    })
    .setBlockRange({
        from: 1
    })
    .addEvent({
        name: [
            // OffchainComputingInfra
            events.offchainComputingInfra.workerRegistered.name,
            events.offchainComputingInfra.workerDeregistered.name,
            events.offchainComputingInfra.workerOnline.name,
            events.offchainComputingInfra.workerUnresponsive.name,
            events.offchainComputingInfra.workerRequestingOffline.name,
            events.offchainComputingInfra.workerOffline.name,
            events.offchainComputingInfra.workerHeartbeatReceived.name,
            events.offchainComputingInfra.workerAttestationRefreshed.name,
            events.offchainComputingInfra.implRegistered.name,
            events.offchainComputingInfra.implDeregistered.name,
            events.offchainComputingInfra.implMetadataUpdated.name,
            events.offchainComputingInfra.implMetadataRemoved.name,
            events.offchainComputingInfra.implBuildRegistered.name,
            events.offchainComputingInfra.implBuildDeregistered.name,
            events.offchainComputingInfra.implBuildStatusUpdated.name,
            // OffchainComputingPool
            events.offchainComputingPool.poolCreated.name,
            events.offchainComputingPool.poolDestroyed.name,
            events.offchainComputingPool.poolMetadataUpdated.name,
            events.offchainComputingPool.poolMetadataRemoved.name,
            events.offchainComputingPool.poolSettingsUpdated.name,
            events.offchainComputingPool.jobPolicyCreated.name,
            events.offchainComputingPool.jobPolicyDestroyed.name,
            events.offchainComputingPool.jobPolicyEnablementUpdated.name,
            events.offchainComputingPool.accountAuthorized.name,
            events.offchainComputingPool.accountRevoked.name,
            events.offchainComputingPool.workerAuthorized.name,
            events.offchainComputingPool.workerRevoked.name,
            events.offchainComputingPool.workerSubscribed.name,
            events.offchainComputingPool.workerUnsubscribed.name,
            events.offchainComputingPool.jobCreated.name,
            events.offchainComputingPool.jobDestroyed.name,
            events.offchainComputingPool.jobAssigned.name,
            events.offchainComputingPool.jobResigned.name,
            events.offchainComputingPool.jobStatusUpdated.name,
            events.offchainComputingPool.jobResultUpdated.name,
        ],
        extrinsic: true,
    })

export type Fields = SubstrateBatchProcessorFields<typeof processor>
export type Context = DataHandlerContext<Store, Fields>
export type Block = BlockHeader<Fields>
