import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { Throttle } from '@nestjs/throttler';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { CreateContactUsDto } from './dtos/contact-us.dto';
import { Request } from 'express';
import { CreateContactEmailVerificationDto } from './dtos/contact-email-verification.dto';
import { SendContactInfoDto } from './dtos/send-contact-info';

@Controller('contact-us')
export class ContactUsController {

  constructor(private readonly contactUsService: ContactUsService) { }
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post()
  @ApiOperation({ summary: 'Create a  about us.' })
  @ApiBody({ type: CreateContactUsDto })
  @ApiResponse({

    status: 201,
    description: 'about us created successfully.',
  })
  create(
    @Req() req: Request,
    @Body() dto: CreateContactUsDto,
  ) {
    return this.contactUsService.createOrUpdate(req, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a contact info' })
  @ApiResponse({
    status: 200,
    description: 'Get contact us info .',
  })
  @ApiResponse({ status: 404, description: 'Reason not found.' })
  findOne() {
    return this.contactUsService.findOne();
  }


  @Post('/contact-email-verification')
  @ApiOperation({ summary: 'Get a contact info' })
  @ApiResponse({
    status: 200,
    description: 'Email send success.',
  })
  @ApiResponse({ status: 404, description: 'Reason not found.' })
  contactEmailVerify(@Body() dto: CreateContactEmailVerificationDto) {
    return this.contactUsService.contactEmailVerification(dto);
  }



  @Post('/send-contact-info')
  @ApiOperation({ summary: 'Send Contact info' })
  @ApiResponse({
    status: 200,
    description: 'Email send success.',
  })
  @ApiOperation({ summary: 'Submit contact information with OTP' })
  @ApiResponse({ status: 201, description: 'Contact info submitted successfully.' })
  sendContactInfo(@Body() dto: SendContactInfoDto) {
    return this.contactUsService.sendContactInfo(dto);
  }
}
