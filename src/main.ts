import fastifyCookie from '@fastify/cookie';
import multiPart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { NestFactory } from '@nestjs/core';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getBotToken } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { AppModule } from './app/app.module';

const bootstrap = async () => {
  const adapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  app.register(fastifyStatic, {
    root: __dirname + '/uploads/',
    prefix: '/public/',
  });

  const config = new DocumentBuilder()
    .setTitle('Example API')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app
    .getHttpAdapter()
    .getInstance()
    .get('/json', (_, reply) => {
      reply.send(document);
    });

  await app.register(fastifyCookie, {
    secret: 'my-secret',
    // TODO: Добавьте env переменные
  });
  await app.register(multiPart);

  app.enableCors({
    origin: process.env.ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
    credentials: true,
  });

  const bot = app.get(getBotToken());
  const stage = new Scenes.Stage();
  bot.use(stage.middleware());
  app.use(bot.webhookCallback('/bot'));

  await app.listen(5001);
};

bootstrap();
