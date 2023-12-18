import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    FELIZ★* 。 • ˚ ˚ ˛ ˚ ˛ •
    •。★ NATAL! ★ 。* 。
    ° 。 ° ˛˚˛ * _Π_____*。*˚
    ˚  ˛ •˛•˚ */______/~＼。˚ ˚ ˛
    ˚ ˛ •˛• ˚ ｜ 田田 ｜門｜ ˚
    `;
  }
}
