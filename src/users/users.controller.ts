import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Usuario criado com sucesso.',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiConflictResponse({ description: 'Email já está em uso' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    if (!id) {
      throw new Error('ID do usuário não fornecido');
    }
    return this.usersService.findById(id);
  }

  @Get()
  @ApiOkResponse({ description: 'Lista de usuários retornada com sucesso' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }
}
