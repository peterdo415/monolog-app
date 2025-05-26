import { Body, Controller, Post, Get, Query, Put, Param, Delete } from '@nestjs/common';
import { HouseholdService } from './household.service.js';
import { CreateHouseholdDto } from '../../dto/create-household.dto.js';
import { itemCategories, units, locations } from '@monolog/db/schema';
import { db } from '@monolog/db/client';

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

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: any) {
    return this.householdService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Query('userEmail') userEmail: string) {
    return this.householdService.remove(id, userEmail);
  }
} 