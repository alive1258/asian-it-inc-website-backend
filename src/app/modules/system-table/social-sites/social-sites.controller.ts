import { Controller, Get } from '@nestjs/common';
import { SocialSitesService } from './social-sites.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('social-sites')
@ApiTags('SocialSites')
export class SocialSitesController {
  constructor(private readonly socialSitesService: SocialSitesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all the data.',
  })
  findAll() {
    return this.socialSitesService.findAll();
  }
}
