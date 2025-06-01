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
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseExceptionFilter } from './app/common/errors/global.errors';
import { DataResponseInterceptor } from './app/common/interceptors/data-response/data-response.interceptor';
import { DataQueryModule } from './app/common/data-query/data-query.module';
import { MailModule } from './app/modules/mail/mail.module';
import { FileUploadsModule } from './app/common/file-uploads/file-uploads.modules';
import { TestimonialsModule } from './app/modules/testimonials/testimonials.module';
import { HomeHeroModule } from './app/modules/home-hero/home-hero.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { WorkGalleryModule } from './app/modules/work-gallery/work-gallery.module';
import jwtConfig from './app/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { DesignationsModule } from './app/modules/designations/designations.module';
import { SocialSitesModule } from './app/modules/system-table/social-sites/social-sites.module';
import { SkillsModule } from './app/modules/skills/skills.module';
import { TeamMembersModule } from './app/modules/team-members/team-members.module';
import { TeamMemberSkillsModule } from './app/modules/team-member-skills/team-member-skills.module';
import { TeamMemberSocialLinksModule } from './app/modules/team-member-social-links/team-member-social-links.module';
import { BlogCategoriesModule } from './app/modules/blog-categories/blog-categories.module';
import { BlogsModule } from './app/modules/blogs/blogs.module';
import { BlogDetailsModule } from './app/modules/blog-details/blog-details.module';
import { FaqModule } from './app/modules/faq/faq.module';
import { ClientsModule } from './app/modules/system-table/clients/clients.module';
import { AboutUsModule } from './app/modules/about-us/about-us.module';
import { WhyChooseUsModule } from './app/modules/why-choose-us/why-choose-us.module';
import { ContactUsModule } from './app/modules/contact-us/contact-us.module';
import { WorkProcessModule } from './app/modules/work-process/work-process.module';
import { SmtpModule } from './app/modules/smtp/smtp.module';
import { ServicesModule } from './app/modules/services/services.module';

/**
 * // Get environment (development/production/etc.)
 *
 */
const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 1,
        },
      ],
    }),

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
        ssl: {
          rejectUnauthorized: false,
        },
        autoLoadEntities: ConfigService.get('database.autoLoadEntities'),
        synchronize: ConfigService.get('database.synchronize'),
      }),
    }),

    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    // Feature modules

    DataQueryModule,
    MailModule,
    FileUploadsModule,
    TestimonialsModule,
    HomeHeroModule,
    WorkGalleryModule,
    DesignationsModule,
    SocialSitesModule,
    SkillsModule,
    TeamMembersModule,
    TeamMemberSkillsModule,
    TeamMemberSocialLinksModule,
    BlogCategoriesModule,
    BlogsModule,
    BlogDetailsModule,
    FaqModule,
    ClientsModule,
    AboutUsModule,
    WhyChooseUsModule,
    ContactUsModule,
    WorkProcessModule,
    SmtpModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

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
