import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

@Entity("tasks")
export class TaskEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 120 })
  title!: string;

  @Column({ type: "text", default: "" })
  description!: string;

  @Column({ type: "varchar", default: "todo" })
  status!: TaskStatus;

  @Column({ type: "varchar", default: "medium" })
  priority!: TaskPriority;

  @Column({ type: "date", nullable: true })
  dueDate!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
