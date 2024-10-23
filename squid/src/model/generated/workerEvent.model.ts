import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, ManyToOne as ManyToOne_, Index as Index_, JSONColumn as JSONColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Worker} from "./worker.model"
import {WorkerEventKind} from "./_workerEventKind"

@Entity_()
export class WorkerEvent {
    constructor(props?: Partial<WorkerEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    sequence!: number

    @Index_()
    @ManyToOne_(() => Worker, {nullable: true})
    refWorker!: Worker

    @Column_("varchar", {length: 20, nullable: false})
    kind!: WorkerEventKind

    @JSONColumn_({nullable: true})
    payload!: unknown | undefined | null

    @IntColumn_({nullable: false})
    blockNumber!: number

    @DateTimeColumn_({nullable: false})
    blockTime!: Date
}
