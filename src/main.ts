import { randomUUID } from 'crypto';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ genReqId: () => randomUUID() }),
    {
      bufferLogs: true,
    },
  );

  app.enableCors();
  app.enableShutdownHooks();
  await app.register(helmet);
  await app.register(fastifyCsrf);

  const logger = app.get(Logger);
  app.useLogger(logger);

  const SWAGGER_PATH = 'docs';
  const config = new DocumentBuilder()
    .setTitle('API document')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, documentFactory);

  await app.listen(3000, '0.0.0.0', (err, address) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.log(`Server listening at ${address}`);
    logger.log(`Documentation at ${address}/${SWAGGER_PATH}`);
  });
}
bootstrap();
