// smtp.module.ts
import { Global, Module } from '@nestjs/common';
import { SmtpService } from './smtp.service';
import { SmtpController } from './smtp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmtpConfig } from './entities/smtp.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SmtpConfig])], // ✅ Needed for repository injection
  controllers: [SmtpController],
  providers: [SmtpService],
  exports: [SmtpService], // ✅ Makes the service available to other modules
})
export class SmtpModule {}
