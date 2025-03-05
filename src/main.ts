import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

/**
 * Main bootstrap function to initialize the NestJS application
 */
async function bootstrap() {
  // Create a NestJS application instance using the AppModule
  const app = await NestFactory.create(AppModule);

  /**
   * Apply global validation pipe:
   * - whitelist: Strip properties that do not have decorators
   * - forbidNonWhitelisted: Throw an error if non-whitelisted properties are provided
   * - transform: Automatically transform payloads to DTO instances
   * - enableImplicitConversion: Allow automatic primitive type conversion
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /**
   * Swagger API documentation configuration:
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Finder Customer Backend API')
    .setDescription('Use the base API URL as http://localhost:5000/api/v1')
    .setTermsOfService('http://localhost:5000/api/v1/terms-of-conditions')
    .addServer('http://localhost:5000/api/v1')
    .setVersion('1.0')
    .build();

  // Generate the Swagger documentation based on the defined configuration
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Set up Swagger UI at the specified endpoint
  SwaggerModule.setup('/api/v1/swagger', app, document);
  // cookie parser
  app.use(cookieParser());

  /**
   * Set a global prefix for all API routes
   * All routes will now start with /api/v1
   */
  app.setGlobalPrefix('/api/v1');

  /**
   * Enable Cross-Origin Resource Sharing (CORS) with the following configurations:
   * - origin: Specifies the allowed origin for requests
   * - methods: Allowed HTTP methods
   * - credentials: Allow cookies and authentication information to be sent
   */
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Start the server on port 5000 and listen for incoming requests
  await app.listen(5000);
}
// Execute the bootstrap function to run the application
bootstrap();
