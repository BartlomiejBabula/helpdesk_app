import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { CreateStoreDto } from './dto/createStore';
import { UpdateStoreDto } from './dto/updateStore';
import { GetStoreListDto } from './dto/getStoreList';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  getStores() {
    return this.storesService.getStores();
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  getStore(@Req() req) {
    return this.storesService.getStoreById(req.params.id);
  }

  @UseGuards(AccessTokenGuard)
  @Post('')
  createNewStore(@Body() createStoreDto: CreateStoreDto, @Req() req) {
    const accessToken = req.headers.authorization;
    return this.storesService.createNewStore(createStoreDto, accessToken);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  updateStore(@Body() updateStoreDto: UpdateStoreDto, @Req() req) {
    const accessToken = req.headers.authorization;
    return this.storesService.updateStore(
      updateStoreDto,
      req.params.id,
      accessToken,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('/store-list')
  getStoreList(@Body() getStoreListDto: GetStoreListDto) {
    return this.storesService.getStoreList(getStoreListDto);
  }
}
