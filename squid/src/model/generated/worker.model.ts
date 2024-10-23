import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, ManyToOne as ManyToOne_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Impl} from "./impl.model"
import {ImplBuild} from "./implBuild.model"
import {WorkerStatus} from "./_workerStatus"
import {AttestationMethod} from "./_attestationMethod"
import {OfflineReason} from "./_offlineReason"
import {WorkerEvent} from "./workerEvent.model"
import {PoolWorkers} from "./poolWorkers.model"
import {Job} from "./job.model"

@Entity_()
export class Worker {
    constructor(props?: Partial<Worker>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    refOwner!: Account

    @StringColumn_({nullable: false})
    ownerAddress!: string

    @Index_()
    @ManyToOne_(() => Impl, {nullable: true})
    refImpl!: Impl

    @IntColumn_({nullable: false})
    implId!: number

    @Index_()
    @ManyToOne_(() => ImplBuild, {nullable: true})
    refImplBuild!: ImplBuild | undefined | null

    @IntColumn_({nullable: true})
    implBuildVersion!: number | undefined | null

    @Index_()
    @Column_("varchar", {length: 17, nullable: false})
    status!: WorkerStatus

    @IntColumn_({nullable: true})
    implSpecVersion!: number | undefined | null

    @Column_("varchar", {length: 6, nullable: true})
    attestationMethod!: AttestationMethod | undefined | null

    @DateTimeColumn_({nullable: true})
    attestationExpiresAt!: Date | undefined | null

    @DateTimeColumn_({nullable: true})
    lastAttestedAt!: Date | undefined | null

    @DateTimeColumn_({nullable: true})
    lastHeartbeatReceivedAt!: Date | undefined | null

    @DateTimeColumn_({nullable: true})
    offlineAt!: Date | undefined | null

    @Column_("varchar", {length: 24, nullable: true})
    offlineReason!: OfflineReason | undefined | null

    @DateTimeColumn_({nullable: true})
    uptimeStartedAt!: Date | undefined | null

    @IntColumn_({nullable: true})
    uptime!: number | undefined | null

    @IntColumn_({nullable: false})
    poolsCount!: number

    @IntColumn_({nullable: false})
    pendingJobsCount!: number

    @IntColumn_({nullable: false})
    processingJobsCount!: number

    @IntColumn_({nullable: false})
    processedJobsCount!: number

    @IntColumn_({nullable: false})
    successfulJobsCount!: number

    @IntColumn_({nullable: false})
    failedJobsCount!: number

    @IntColumn_({nullable: false})
    erroredJobsCount!: number

    @IntColumn_({nullable: false})
    panickyJobsCount!: number

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: false})
    updatedAt!: Date

    @DateTimeColumn_({nullable: true})
    deletedAt!: Date | undefined | null

    @OneToMany_(() => WorkerEvent, e => e.refWorker)
    events!: WorkerEvent[]

    @OneToMany_(() => PoolWorkers, e => e.refWorker)
    subscribedPools!: PoolWorkers[]

    @OneToMany_(() => Job, e => e.refAssignee)
    assignedJobs!: Job[]
}
