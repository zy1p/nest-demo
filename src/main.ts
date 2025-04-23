import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { randomUUID } from 'crypto';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { Logger } from 'nestjs-pino';
import { patchNestJsSwagger } from 'nestjs-zod';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import type { Env } from './env.validation';
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

  const configService = app.get(ConfigService<Env, true>);
  const port = configService.get('PORT', { infer: true });

  const SWAGGER_PATH = 'docs';
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API document')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, documentFactory);
  patchNestJsSwagger();

  await app.listen(port, '0.0.0.0', (err, address) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.log(`Server listening at ${address}`);
    logger.log(`Documentation at ${address}/${SWAGGER_PATH}`);
  });
}
bootstrap();
