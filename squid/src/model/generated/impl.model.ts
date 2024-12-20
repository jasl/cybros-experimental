import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {AttestationMethod} from "./_attestationMethod"
import {ImplBuild} from "./implBuild.model"
import {Worker} from "./worker.model"
import {Pool} from "./pool.model"

@Entity_()
export class Impl {
    constructor(props?: Partial<Impl>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    implId!: number

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    refOwner!: Account

    @StringColumn_({nullable: false})
    ownerAddress!: string

    @Column_("varchar", {length: 6, nullable: false})
    attestationMethod!: AttestationMethod

    @StringColumn_({nullable: true})
    metadata!: string | undefined | null

    @IntColumn_({nullable: false})
    onlineWorkersCount!: number

    @IntColumn_({nullable: false})
    poolsCount!: number

    @IntColumn_({nullable: false})
    jobsCount!: number

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: false})
    updatedAt!: Date

    @DateTimeColumn_({nullable: true})
    deletedAt!: Date | undefined | null

    @OneToMany_(() => ImplBuild, e => e.refImpl)
    builds!: ImplBuild[]

    @OneToMany_(() => Worker, e => e.refImpl)
    workers!: Worker[]

    @OneToMany_(() => Pool, e => e.refImpl)
    pools!: Pool[]
}
