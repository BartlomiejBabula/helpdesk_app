import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stores } from './entities/stores.entity';
import { CreateStoreDto } from './dto/createStore';
import { UpdateStoreDto } from './dto/updateStore';
import { samboDbConfig } from 'src/samboDB';
import { GetStoreListDto } from './dto/getStoreList';
import { Cron } from '@nestjs/schedule';
import xlsx from 'node-xlsx';

const oracledb = require('oracledb');

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Stores)
    private storesRepository: Repository<Stores>,
  ) {}

  async getStores(): Promise<Stores[] | null> {
    return this.storesRepository.find();
  }

  async getStoreById(id: number): Promise<Stores | null> {
    return this.storesRepository.findOne({ where: { id } });
  }

  async createNewStore(
    createStoreDto: CreateStoreDto,
  ): Promise<Stores | string> {
    const newStore = createStoreDto;
    const newStoreExist = await this.storesRepository.findOne({
      where: { storeNumber: newStore.storeNumber },
    });
    if (newStoreExist) {
      return `Store exists with number ${newStore.storeNumber}`;
    } else {
      const store = new Stores();
      store.information = newStore.information;
      store.status = newStore.status;
      store.storeNumber = newStore.storeNumber;
      store.storeType = newStore.storeType;
      await this.storesRepository.save(store);
      return store;
    }
  }

  async updateStore(
    updateStoreDto: UpdateStoreDto,
    id: number,
  ): Promise<Stores | string> {
    const storeSelected = await this.storesRepository.findOne({
      where: { id },
    });
    if (storeSelected) {
      if (
        updateStoreDto.storeType !== storeSelected.storeType ||
        updateStoreDto.status !== storeSelected.status ||
        (updateStoreDto.information &&
          updateStoreDto.information !== storeSelected.information)
      ) {
        await this.storesRepository.update({ id }, updateStoreDto);
        return await this.storesRepository.findOne({
          where: { id },
        });
      } else {
        return `No data to update`;
      }
    } else {
      return `No store ID: ${id}`;
    }
  }

  async getStoreList(getStoreList: GetStoreListDto): Promise<any> {
    const conn = await oracledb.getConnection(samboDbConfig);
    const result = await conn.execute(
      `select * from es_stores where status in (${getStoreList.type}) and store_type in (${getStoreList.storeType})`,
    );
    let storeList: any = [];
    result.rows.forEach((store: { STORE_NUMBER: string }) => {
      storeList = [...storeList, store.STORE_NUMBER];
    });
    await conn.close();
    return storeList;
  }

  @Cron('0 */30 * * * *')
  async automaticUpdateStores() {
    try {
      const workSheetsFromFile = xlsx.parse(`/usr/src/app/lista-sklepow.xlsx`);
      await this.storesRepository.clear();
      console.log('automatic stores list update');
      workSheetsFromFile[0].data.map((store: any, id) => {
        if (id !== 0) {
          let newStore = new Stores();
          newStore = {
            ...newStore,
            storeNumber: store[0],
            storeType: store[2],
            status: store[3],
            information: store[1] ? store[1] : '',
          };
          this.storesRepository.save(newStore);
        }
      });

      const fs = require('fs');
      fs.existsSync(`/usr/src/app/lista-sklepow.xlsx`) &&
        fs.unlink(`/usr/src/app/lista-sklepow.xlsx`, (err: any) => {
          if (err) {
            console.error(err);
            return;
          }
        });
    } catch (error) {}
  }
}
