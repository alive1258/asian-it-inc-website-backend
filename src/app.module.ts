import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './app/modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import profileConfig from './app/modules/users/config/profile.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from './app/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationGuard } from './app/auth/guards/authentication/authentication.guard';
import { DatabaseExceptionFilter } from './app/common/errors/global.errors';
import { DataResponseInterceptor } from './app/common/interceptors/data-response/data-response.interceptor';
import { InitialAuthenticationGuard } from './app/auth/guards/authentication/initial.guard';
import { DataQueryModule } from './app/common/data-query/data-query.module';
import { MailModule } from './app/modules/mail/mail.module';
import { FileUploadsModule } from './app/common/file-uploads/file-uploads.modules';
import { TestimonialsModule } from './app/modules/testimonials/testimonials.module';

/**
 * // Get environment (development/production/etc.)
 *
 */
const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    // Load environment variables and global configs
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig, profileConfig],
      validationSchema: environmentValidation,
    }),

    // Database connection with async configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get('database.host'),
        port: +ConfigService.get('database.port'),
        username: ConfigService.get('database.user'),
        password: ConfigService.get('database.password'),
        database: ConfigService.get('database.name'),
        autoLoadEntities: ConfigService.get('database.autoLoadEntities'),
        synchronize: ConfigService.get('database.synchronize'),
      }),
    }),

    // JWT authentication module setup
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    // Feature modules

    DataQueryModule,
    MailModule,
    FileUploadsModule,
    TestimonialsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global Guards
    {
      provide: APP_GUARD,
      useClass: InitialAuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, // For response serialization
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
    // Global Error Filter
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter, // Custom database exception handling
    },
  ],
})
export class AppModule {}
