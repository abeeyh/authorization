import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Silvio Almeida',
    description: `Nome do usuário.`,
  })
  name: string;

  @ApiProperty({
    example: 'email@email.com',
    description: `O e-mail é necessário apra o login.`,
  })
  email: string;

  @ApiProperty({
    example: '123password123',
    description: `Senha do usuário criptografada`,
  })
  password: string;
}
