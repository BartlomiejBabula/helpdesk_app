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
import { LoggerService } from 'src/logger/logger.service';
import { LogStatus } from 'src/logger/dto/getLog';
import { LogTaskType } from 'src/logger/dto/createLog';
import { ObjectId } from 'mongodb';

const oracledb = require('oracledb');

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Stores)
    private storesRepository: Repository<Stores>,
    private loggerService: LoggerService,
  ) {}

  async getStores(): Promise<Stores[] | null> {
    return this.storesRepository.find();
  }

  async getStoreById(id: ObjectId): Promise<Stores | null> {
    return this.storesRepository.findOne({ where: { _id: id } });
  }

  async createNewStore(
    createStoreDto: CreateStoreDto,
    accessToken: string,
  ): Promise<Stores | string> {
    const id = await this.loggerService.createLog({
      task: LogTaskType.CREATE_STORE,
      status: LogStatus.OPEN,
      accessToken: accessToken,
    });
    const newStore = createStoreDto;
    const newStoreExist = await this.storesRepository.findOne({
      where: { storeNumber: newStore.storeNumber },
    });
    if (newStoreExist) {
      await this.loggerService.createLog({
        accessToken: accessToken,
        task: LogTaskType.CREATE_STORE,
        status: LogStatus.DONE,
        taskId: id,
        description: `Store exists with number ${newStore.storeNumber}`,
      });
      return `Store exists with number ${newStore.storeNumber}`;
    } else {
      const store = new Stores();
      store.information = newStore.information;
      store.status = newStore.status;
      store.storeNumber = newStore.storeNumber;
      store.storeType = newStore.storeType;
      await this.storesRepository.insert(store);
      await this.loggerService.createLog({
        accessToken: accessToken,
        task: LogTaskType.CREATE_STORE,
        status: LogStatus.DONE,
        taskId: id,
        description: `Store created ${newStore.storeNumber}`,
      });
      return store;
    }
  }

  async updateStore(
    updateStoreDto: UpdateStoreDto,
    id: number,
    accessToken: string,
  ): Promise<Stores | string> {
    const logId = await this.loggerService.createLog({
      task: LogTaskType.UPDATE_STORE_LIST,
      status: LogStatus.OPEN,
      accessToken: accessToken,
    });
    const storeSelected = await this.storesRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (storeSelected) {
      if (
        updateStoreDto.storeType !== storeSelected.storeType ||
        updateStoreDto.status !== storeSelected.status ||
        updateStoreDto.information !== storeSelected.information
      ) {
        const newStore = {
          storeNumber: updateStoreDto.storeNumber,
          storeType: updateStoreDto.storeType,
          status: updateStoreDto.status,
          information: updateStoreDto.information,
        };
        await this.storesRepository.update({ _id: new ObjectId(id) }, newStore);
        await this.loggerService.createLog({
          taskId: logId,
          task: LogTaskType.UPDATE_STORE_LIST,
          status: LogStatus.DONE,
          accessToken: accessToken,
          description: `Store ${storeSelected.storeNumber} updated`,
        });
        return await this.storesRepository.findOne({
          where: { _id: new ObjectId(id) },
        });
      } else {
        await this.loggerService.createLog({
          taskId: logId,
          task: LogTaskType.UPDATE_STORE_LIST,
          status: LogStatus.DONE,
          accessToken: accessToken,
          description: `No data to update`,
        });
        return `No data to update`;
      }
    } else {
      await this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.UPDATE_STORE_LIST,
        status: LogStatus.DONE,
        accessToken: accessToken,
        description: `No store ID: ${id}`,
      });
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

  @Cron('*/30 * * * *', {
    name: LogTaskType.UPDATE_STORE_LIST,
  })
  async automaticUpdateStores() {
    const logId = await this.loggerService.createLog({
      task: LogTaskType.UPDATE_STORE_LIST,
      status: LogStatus.OPEN,
    });
    try {
      const workSheetsFromFile = xlsx.parse(`/usr/src/app/lista-sklepow.xlsx`);
      await this.storesRepository.clear();
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
          this.storesRepository.insert(newStore);
        }
      });
      const fs = require('fs');
      fs.existsSync(`/usr/src/app/lista-sklepow.xlsx`) &&
        fs.unlink(`/usr/src/app/lista-sklepow.xlsx`, (error: any) => {
          if (error) {
            this.loggerService.createLog({
              taskId: logId,
              task: LogTaskType.UPDATE_STORE_LIST,
              status: LogStatus.DONE,
              description: `${error}`,
            });
            return;
          }
        });
      await this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.UPDATE_STORE_LIST,
        status: LogStatus.DONE,
        description: 'Store List updated',
      });
    } catch (error) {
      await this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.UPDATE_STORE_LIST,
        status: LogStatus.DONE,
        description: `${error}`,
      });
    }
  }
}
