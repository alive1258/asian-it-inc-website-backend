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
import { AttendanceModule } from './app/modules/attendance/attendance.module';
import { DatabaseExceptionFilter } from './app/common/errors/global.errors';
import { GroupTypesModule } from './app/modules/group-types/group-types.module';
import { GroupsModule } from './app/modules/groups/groups.module';
import { DataResponseInterceptor } from './app/common/interceptors/data-response/data-response.interceptor';
import { InitialAuthenticationGuard } from './app/auth/guards/authentication/initial.guard';
import { MembersModule } from './app/modules/members/members.module';
import { PackagesModule } from './app/modules/packages/packages.module';
import { PointsModule } from './app/modules/points/points.module';
import { DataQueryModule } from './app/common/data-query/data-query.module';
import { MailModule } from './app/modules/mail/mail.module';
import { PricingModule } from './app/modules/pricing/pricing.module';
import { FaqsModule } from './app/modules/faqs/faqs.module';
import { FileUploadsModule } from './app/common/file-uploads/file-uploads.modules';
import { TestimonialsModule } from './app/modules/testimonials/testimonials.module';
import { FaqAnsModule } from './app/modules/faq-ans/faq-ans.module';

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
    AttendanceModule,
    GroupTypesModule,
    GroupsModule,
    MembersModule,
    PackagesModule,
    PointsModule,
    DataQueryModule,
    MailModule,
    PricingModule,
    FaqsModule,
    FileUploadsModule,
    TestimonialsModule,
    FaqAnsModule,
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
