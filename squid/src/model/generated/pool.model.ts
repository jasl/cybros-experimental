import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, DateTimeColumn as DateTimeColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Impl} from "./impl.model"
import {JobScheduler} from "./_jobScheduler"
import {PoolWorkers} from "./poolWorkers.model"
import {JobPolicy} from "./jobPolicy.model"
import {Job} from "./job.model"

@Entity_()
export class Pool {
    constructor(props?: Partial<Pool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    poolId!: number

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

    @Column_("varchar", {length: 10, nullable: false})
    jobScheduler!: JobScheduler

    @BooleanColumn_({nullable: false})
    createJobEnabled!: boolean

    @BooleanColumn_({nullable: false})
    autoDestroyProcessedJobEnabled!: boolean

    @StringColumn_({nullable: true})
    metadata!: string | undefined | null

    @IntColumn_({nullable: false})
    workersCount!: number

    @IntColumn_({nullable: false})
    onlineWorkersCount!: number

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

    @OneToMany_(() => PoolWorkers, e => e.refPool)
    workers!: PoolWorkers[]

    @OneToMany_(() => JobPolicy, e => e.refPool)
    jobPolicies!: JobPolicy[]

    @OneToMany_(() => Job, e => e.refPool)
    jobs!: Job[]
}
