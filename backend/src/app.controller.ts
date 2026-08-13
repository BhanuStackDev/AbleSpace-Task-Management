import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: "AbleSpace Backend API is running",
      status: "ok",
      api: "/api/tasks",
    };
  }

  @Get("health")
  getHealth() {
    return {
      status: "ok",
    };
  }
}