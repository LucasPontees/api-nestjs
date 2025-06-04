import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const emailJaExiste = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailJaExiste) throw new BadRequestException('Email já está em uso');

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
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

    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }
}
