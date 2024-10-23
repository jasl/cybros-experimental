import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, ManyToOne as ManyToOne_, Index as Index_, BooleanColumn as BooleanColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Pool} from "./pool.model"
import {ApplicableScope} from "./_applicableScope"

@Entity_()
export class JobPolicy {
    constructor(props?: Partial<JobPolicy>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    policyId!: number

    @Index_()
    @ManyToOne_(() => Pool, {nullable: true})
    refPool!: Pool

    @IntColumn_({nullable: false})
    poolId!: number

    @BooleanColumn_({nullable: false})
    enabled!: boolean

    @Column_("varchar", {length: 9, nullable: false})
    applicableScope!: ApplicableScope

    @IntColumn_({nullable: true})
    startBlock!: number | undefined | null

    @IntColumn_({nullable: true})
    endBlock!: number | undefined | null

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: false})
    updatedAt!: Date

    @DateTimeColumn_({nullable: true})
    deletedAt!: Date | undefined | null
}
