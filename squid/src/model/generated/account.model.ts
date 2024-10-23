import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Worker} from "./worker.model"
import {Pool} from "./pool.model"
import {Job} from "./job.model"

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    /**
     * Account address
     */
    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    workersCount!: number

    @IntColumn_({nullable: false})
    poolsCount!: number

    @IntColumn_({nullable: false})
    createdJobsCount!: number

    @OneToMany_(() => Worker, e => e.refOwner)
    owningWorkers!: Worker[]

    @OneToMany_(() => Pool, e => e.refOwner)
    owningPools!: Pool[]

    @OneToMany_(() => Job, e => e.refBeneficiary)
    beneficialJobs!: Job[]
}
