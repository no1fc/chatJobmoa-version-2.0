import { Controller, Get } from '@nestjs/common';
import { SmeBenefitService } from '../services/smeBenefit.service';

@Controller('benefits')
export class SmeBenefitController {
  constructor(private readonly smeBenefitService: SmeBenefitService) {}

  @Get()
  async getActiveBenefits() {
    return this.smeBenefitService.getActiveBenefits();
  }
}
