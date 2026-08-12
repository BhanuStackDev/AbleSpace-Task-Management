import { IsDateString, IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsIn(["todo", "in-progress", "completed"])
  status?: "todo" | "in-progress" | "completed";

  @IsOptional()
  @IsIn(["low", "medium", "high"])
  priority?: "low" | "medium" | "high";

  @IsOptional()
  @IsDateString()
  dueDate?: string | null;
}
