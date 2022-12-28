import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { clientUrl } from './utils/constants';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const cors = require('cors');
import { OpenApiNestFactory } from 'nest-openapi-tools';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: clientUrl, credentials: true },
  });

  const config = new DocumentBuilder()
    .setTitle('NESTJS REST API')
    .setDescription('API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await OpenApiNestFactory.configure(
    app,
    new DocumentBuilder()
      .setTitle('My API')
      .setDescription('API')
      .addBearerAuth(),
    {
      webServerOptions: {
        enabled: true,
        path: '',
      },
      fileGeneratorOptions: {
        enabled: true,
        outputFilePath: './openapi.json',
      },
      clientGeneratorOptions: {
        enabled: true,
        type: 'typescript-axios',
        outputFolderPath: '../todo-backend/src',
        additionalProperties:
          'apiPackage=clients,modelPackage=models,withoutPrefixEnums=true,withSeparateModelsAndApi=true',
        openApiFilePath: './openapi.json',
        skipValidation: false,
      },
    },
    {
      operationIdFactory: (c: string, method: string) => method,
    },
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(helmet());

  app.use(cookieParser());
  app.use(cors());

  await app.listen(5000);
}
bootstrap();
