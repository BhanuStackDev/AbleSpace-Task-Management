import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksModule } from "./tasks/tasks.module";
import { AppController } from "./app.controller";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "ablespace.sqlite",
      autoLoadEntities: true,
      synchronize: true,
    }),
    TasksModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
