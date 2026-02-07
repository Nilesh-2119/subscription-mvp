import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        // Fetch profileId based on role
        let profileId: string | undefined = undefined;
        if (user.role === 'CUSTOMER') {
            const profile = await this.prisma.customerProfile.findUnique({
                where: { userId: user.id }
            });
            profileId = profile?.id;
        } else if (user.role === 'VENDOR') {
            const profile = await this.prisma.vendorProfile.findUnique({
                where: { userId: user.id }
            });
            profileId = profile?.id;
        }

        const payload = { email: user.email, sub: user.id, role: user.role, profileId };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                profileId
            }
        };
    }

    async register(data: any) {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(data.password, salt);

        // Transaction to create User and Profile
        const user = await this.prisma.$transaction(async (prisma) => {
            const newUser = await prisma.user.create({
                data: {
                    email: data.email,
                    passwordHash,
                    fullName: data.fullName,
                    role: data.role || 'CUSTOMER',
                },
            });

            if (data.role === 'VENDOR') {
                await prisma.vendorProfile.create({
                    data: {
                        userId: newUser.id,
                        businessName: data.businessName || `${data.fullName}'s Business`,
                        phone: data.phone || '0000000000',
                    },
                });
            } else if (data.role === 'CUSTOMER') {
                await prisma.customerProfile.create({
                    data: {
                        userId: newUser.id,
                        phone: data.phone,
                    }
                });
            }

            return newUser;
        });

        return this.login(user);
    }
}
