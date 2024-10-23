import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, DateTimeColumn as DateTimeColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Pool} from "./pool.model"
import {JobPolicy} from "./jobPolicy.model"
import {Account} from "./account.model"
import {Worker} from "./worker.model"
import {JobStatus} from "./_jobStatus"
import {JobResult} from "./_jobResult"
import {JobEvent} from "./jobEvent.model"

@Entity_()
export class Job {
    constructor(props?: Partial<Job>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    jobId!: number

    @Index_()
    @StringColumn_({nullable: true})
    uniqueTrackId!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Pool, {nullable: true})
    refPool!: Pool

    @IntColumn_({nullable: false})
    poolId!: number

    @Index_()
    @ManyToOne_(() => JobPolicy, {nullable: true})
    refPolicy!: JobPolicy

    @IntColumn_({nullable: false})
    policyId!: number

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    refDepositor!: Account

    @StringColumn_({nullable: false})
    depositorAddress!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    refBeneficiary!: Account

    @StringColumn_({nullable: false})
    beneficiaryAddress!: string

    @Index_()
    @ManyToOne_(() => Worker, {nullable: true})
    refAssignee!: Worker | undefined | null

    @StringColumn_({nullable: true})
    assigneeAddress!: string | undefined | null

    @IntColumn_({nullable: true})
    implBuildVersion!: number | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    refDestroyer!: Account | undefined | null

    @StringColumn_({nullable: true})
    destroyerAddress!: string | undefined | null

    @Index_()
    @Column_("varchar", {length: 10, nullable: false})
    status!: JobStatus

    @Column_("varchar", {length: 7, nullable: true})
    result!: JobResult | undefined | null

    @IntColumn_({nullable: false})
    implSpecVersion!: number

    @StringColumn_({nullable: true})
    input!: string | undefined | null

    @StringColumn_({nullable: true})
    output!: string | undefined | null

    @StringColumn_({nullable: true})
    proof!: string | undefined | null

    @DateTimeColumn_({nullable: false})
    expiresAt!: Date

    @DateTimeColumn_({nullable: true})
    assignedAt!: Date | undefined | null

    @DateTimeColumn_({nullable: true})
    processingAt!: Date | undefined | null

    @DateTimeColumn_({nullable: true})
    endedAt!: Date | undefined | null

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: false})
    updatedAt!: Date

    @DateTimeColumn_({nullable: true})
    deletedAt!: Date | undefined | null

    @OneToMany_(() => JobEvent, e => e.refJob)
    events!: JobEvent[]
}
