import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, ManyToOne as ManyToOne_, Index as Index_, JSONColumn as JSONColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Job} from "./job.model"
import {JobEventKind} from "./_jobEventKind"

@Entity_()
export class JobEvent {
    constructor(props?: Partial<JobEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    sequence!: number

    @Index_()
    @ManyToOne_(() => Job, {nullable: true})
    refJob!: Job

    @Column_("varchar", {length: 10, nullable: false})
    kind!: JobEventKind

    @JSONColumn_({nullable: true})
    payload!: unknown | undefined | null

    @IntColumn_({nullable: false})
    blockNumber!: number

    @DateTimeColumn_({nullable: false})
    blockTime!: Date
}
