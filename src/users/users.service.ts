import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

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

  async findAll() {
    return this.prisma.user.findMany();
  }
}
