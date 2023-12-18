import {
  Controller,
  Post,
  Req,
  Body,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ErrorMessages } from '../errorhandler/constants/errorMessages';

@ApiTags('token')
@Controller('token')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })
  async generateToken(@Body() body: { email: string; password: string }) {
    return await this.authService.generateToken(body);
  }

  @Post('refresh')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  refreshToken(@Req() req) {
    const authHeader = req.headers.authorization;

    return this.authService.refreshToken(
      authHeader.replace('Bearer ', '').trim()
    );
  }
}
