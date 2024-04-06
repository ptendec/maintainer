import fastifyCookie from '@fastify/cookie';
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
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

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

  app.enableCors({
    origin: process.env.ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept'], // Allow these headers
    credentials: true, // Указываете, поддерживаются ли учетные данные (куки, HTTP аутентификация и т.д.)
  });

  await app.register(fastifyCookie, {
    secret: 'my-secret',
    // TODO: Добавьте env переменные
  });
  const bot = app.get(getBotToken());
  const stage = new Scenes.Stage();
  bot.use(stage.middleware());
  app.use(bot.webhookCallback('/bot'));

  await app.listen(5001);
};

bootstrap();
