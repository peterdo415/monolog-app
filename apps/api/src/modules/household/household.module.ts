import { Module } from '@nestjs/common';
import { HouseholdController } from './household.controller.js';
import { HouseholdService } from './household.service.js';

@Module({
  controllers: [HouseholdController],
  providers: [HouseholdService],
})
export class HouseholdModule {} 