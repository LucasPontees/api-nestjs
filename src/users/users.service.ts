import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const hashedPassword = await argon2.hash(data.password);
    const emailJaExiste = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailJaExiste) throw new BadRequestException('Email já está em uso');

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.email && dto.email !== user.email) {
      const emailJaExiste = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (emailJaExiste) throw new BadRequestException('Email já está em uso');
    }

    const dataToUpdate = { ...dto };

    if (dto.password) {
      dataToUpdate.password = await argon2.hash(dto.password);
    }

    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async findById(id: string) {
    const usuario = await this.prisma.user.findUnique({
      where: { id, deleted: 'N' },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { deleted: 'N' },
    });
  }

  async softDelete(id: string) {
    const usuario = await this.prisma.user.update({
      where: { id },
      data: { deleted: 'S' },
    });

    return { message: 'Usuário marcado como deletado com sucesso', usuario };
  }
}
