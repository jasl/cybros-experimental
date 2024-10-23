import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Impl} from "./impl.model"
import {ImplBuildStatus} from "./_implBuildStatus"

@Entity_()
export class ImplBuild {
    constructor(props?: Partial<ImplBuild>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Impl, {nullable: true})
    refImpl!: Impl

    @IntColumn_({nullable: false})
    implId!: number

    @IntColumn_({nullable: false})
    version!: number

    @StringColumn_({nullable: true})
    magicBytes!: string | undefined | null

    @Column_("varchar", {length: 12, nullable: false})
    status!: ImplBuildStatus

    @IntColumn_({nullable: false})
    onlineWorkersCount!: number

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: false})
    updatedAt!: Date

    @DateTimeColumn_({nullable: true})
    deletedAt!: Date | undefined | null
}
