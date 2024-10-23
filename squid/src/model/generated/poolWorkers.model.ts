import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Pool} from "./pool.model"
import {Worker} from "./worker.model"

@Entity_()
export class PoolWorkers {
    constructor(props?: Partial<PoolWorkers>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Pool, {nullable: true})
    refPool!: Pool

    @IntColumn_({nullable: false})
    poolId!: number

    @Index_()
    @ManyToOne_(() => Worker, {nullable: true})
    refWorker!: Worker

    @StringColumn_({nullable: false})
    workerAddress!: string

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: false})
    updatedAt!: Date

    @DateTimeColumn_({nullable: true})
    deletedAt!: Date | undefined | null
}
