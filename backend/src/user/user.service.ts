import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from 'prisma/generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { firstName, lastName, email, password, repeatPassword } =
      createUserDto;
    if (password !== repeatPassword)
      throw new BadRequestException('Passwords do not match');

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser)
      throw new ConflictException('User already exists with this email');

    const passwordHash = await bcrypt.hash(password, 10);
    const createdUser = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
      },
    });

    const safeUser = { ...createdUser };
    delete (safeUser as Record<string, any>).passwordHash;
    return { success: true, message: 'Post uploaded', data: safeUser };
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { hashedRefreshToken } = updateUserDto;
    await this.prisma.user.update({
      data: {
        hashedRefreshToken,
      },
      where: {
        id,
      },
    });
  }

  remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
