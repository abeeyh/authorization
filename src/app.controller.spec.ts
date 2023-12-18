/* eslint-disable no-alert, no-console */

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return a message"', () => {
      expect(appController.getHello()).toBe(`
    FELIZ★* 。 • ˚ ˚ ˛ ˚ ˛ •
    •。★ NATAL! ★ 。* 。
    ° 。 ° ˛˚˛ * _Π_____*。*˚
    ˚  ˛ •˛•˚ */______/~＼。˚ ˚ ˛
    ˚ ˛ •˛• ˚ ｜ 田田 ｜門｜ ˚
    `);
    });
  });
});
