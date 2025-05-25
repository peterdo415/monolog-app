import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { HouseholdService } from './household.service.js';
import { CreateHouseholdDto } from '../../dto/create-household.dto.js';

@Controller('household_items')
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @Post()
  async create(@Body() dto: CreateHouseholdDto) {
    return this.householdService.create(dto);
  }

  @Get()
  async findAll(@Query('userEmail') userEmail: string) {
    return this.householdService.findAll(userEmail);
  }
} 