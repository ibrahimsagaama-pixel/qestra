import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('city') city?: string,
  ) {
    return this.providersService.findAll(category, city);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyProfile(@CurrentUser() user: any) {
    return this.providersService.getMyProfile(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createProfile(@CurrentUser() user: any, @Body() dto: CreateProviderDto) {
    return this.providersService.createProfile(user.id, dto);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(@CurrentUser() user: any, @Body() dto: Partial<CreateProviderDto>) {
    return this.providersService.updateProfile(user.id, dto);
  }
}
