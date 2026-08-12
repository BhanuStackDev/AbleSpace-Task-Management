import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskEntity } from "./entities/task.entity";

const seedTasks = [
  {
    title: "Design dashboard",
    description: "Create the main dashboard interface based on the product requirements.",
    status: "todo" as const,
    priority: "high" as const,
    dueDate: "2026-08-12",
  },
  {
    title: "Review task requirements",
    description: "Review the task management requirements and prepare the implementation plan.",
    status: "in-progress" as const,
    priority: "medium" as const,
    dueDate: "2026-08-10",
  },
  {
    title: "Set up project",
    description: "Initialize the project structure and configure the development environment.",
    status: "completed" as const,
    priority: "low" as const,
    dueDate: "2026-08-08",
  },
];

@Injectable()
export class TasksService {
  constructor(@InjectRepository(TaskEntity) private readonly tasks: Repository<TaskEntity>) {}

  async findAll() {
    const count = await this.tasks.count();
    if (count === 0) {
      await this.tasks.save(seedTasks.map((task) => this.tasks.create(task)));
    }
    return this.tasks.find({ order: { createdAt: "DESC" } });
  }

  async create(dto: CreateTaskDto) {
    const task = this.tasks.create({
      ...dto,
      dueDate: dto.dueDate ? dto.dueDate.slice(0, 10) : null,
      status: "todo",
    });
    return this.tasks.save(task);
  }

  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.tasks.findOne({ where: { id } });
    if (!task) throw new NotFoundException("Task not found");
    Object.assign(task, dto);
    if (dto.dueDate !== undefined && dto.dueDate !== null) task.dueDate = dto.dueDate.slice(0, 10);
    return this.tasks.save(task);
  }

  async remove(id: string) {
    const result = await this.tasks.delete(id);
    if (!result.affected) throw new NotFoundException("Task not found");
    return { success: true };
  }
}
