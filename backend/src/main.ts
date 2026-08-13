import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { RequestMethod } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api", {
    exclude: [{ path: "/", method: RequestMethod.GET }],
  });

  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, "0.0.0.0");
}

bootstrap();
