import { IsDateString, IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @IsString()
  @MaxLength(2000)
  description!: string;

  @IsIn(["low", "medium", "high"])
  priority!: "low" | "medium" | "high";

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
