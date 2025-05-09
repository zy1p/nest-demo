import type { Env } from '@lib/env';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { randomUUID } from 'crypto';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import { ENV } from '@lib/env';
import { Logger } from 'nestjs-pino';
import { patchNestJsSwagger } from 'nestjs-zod';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  await app.register(fastifyHelmet);
  await app.register(fastifyCookie);

  const env = app.get<Env>(ENV);
  const logger = app.get(Logger);
  app.useLogger(logger);

  const SWAGGER_PATH = 'docs';
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API document')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, documentFactory, {
    swaggerOptions: { persistAuthorization: true, docExpansion: 'none' },
  });
  patchNestJsSwagger();

  await app.listen(env.PORT, '0.0.0.0', (err, address) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.log(`Server listening at ${address}`);
    logger.log(`Documentation at ${address}/${SWAGGER_PATH}`);
  });
}
bootstrap();
