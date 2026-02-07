import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(data.passwordHash, salt); // Assuming input is raw password mapped to passwordHash

        // In a real DTO mapping we would swap 'password' for 'passwordHash', 
        // but for now let's assume the controller passes data correctly or we handle it here.
        // Let's handle generic creation safely.

        return this.prisma.user.create({
            data: {
                ...data,
                passwordHash,
            },
        });
    }

    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
}
