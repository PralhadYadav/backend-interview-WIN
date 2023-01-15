import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { constant } from './shared/constant/constant';
import { LoggerInterceptor } from './shared/interceptor/logger.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    origin: '*',
    methods: 'GET, HEAD',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.setGlobalPrefix(constant.PREFIX.GLOBAL_PREFIX); // Setting global prefix for all apis.

  app.useGlobalInterceptors(new LoggerInterceptor()); // LoggerInterceptor logs details about details of request and calculate response time.

  const config = new DocumentBuilder() // Document config for Swagger
    .setTitle('Order-Management App')
    .setDescription(
      'Order Management App given details about current or past orders',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config); // Swagger document created.
  SwaggerModule.setup(constant.PREFIX.SWAGGER_PREFIX, app, document); // Swagger starts with setup function.

  await app.listen(process.env.PORT || 3000); // if PORT from env is provided application will start on that port or default 3000.
}
bootstrap();
