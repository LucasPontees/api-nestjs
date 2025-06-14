import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { file as MulterFile } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'senhaSegura123@' },
        avatarUrl: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem do avatar',
        },
      },
      required: ['name', 'email', 'password'],
    },
  })
  @UseInterceptors(
    FileInterceptor('avatarUrl', {
      storage: diskStorage({
        destination: path.resolve(process.cwd(), 'uploads'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Apenas imagens são permitidas!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: MulterFile,
  ) {
    let avatarUrl: string | undefined = undefined;
    if (file) {
      avatarUrl = `uploads/${file.filename}`;
    }
    try {
      return await this.usersService.create({ ...createUserDto, avatarUrl });
    } catch (error) {
      if (file) {
        fs.unlink(path.resolve(file.path), (err) => {
          if (err) {
            console.error('Erro ao deletar arquivo:', err);
          }
        });
      }
      throw error;
    }
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

  @Patch(':id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads'), // <- Caminho absoluto
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      
      fileFilter: (req, file, cb) => {
        // Aceita apenas imagens
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Apenas imagens são permitidas!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: MulterFile,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }
    // Atualiza o usuário com o caminho do avatar
    const avatarUrl = `/uploads/${file.filename}`;
    return this.usersService.update(id, { avatarUrl } as UpdateUserDto);
  }
}
