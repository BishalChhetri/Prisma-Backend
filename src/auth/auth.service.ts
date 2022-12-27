import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto, AuthDtoSignin, AuthDtoUpdatePassword } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  //SignUP
  async signup(dto: AuthDto) {
    const { name, email, password } = dto;

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    await this.prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    delete user.hashedPassword;

    return { user };
  }

  // SignIn
  async signin(dto: AuthDtoSignin, req: Request, res: Response) {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('Wrong credentials');
    }

    const compareSuccess = await this.comparePasswords({
      password,
      hash: foundUser.hashedPassword,
    });

    if (!compareSuccess) {
      throw new BadRequestException('Wrong credentials');
    }

    const token = await this.signToken({
      userId: foundUser.id,
      email: foundUser.email,
    });

    if (!token) {
      throw new ForbiddenException('Could not signin');
    }

    res.cookie('token', token, {});

    delete foundUser.hashedPassword;
    return res.send({ ...foundUser, token });
  }

  // Update Password
  async updatePassword(
    dto: AuthDtoUpdatePassword,
    req: Request,
    res: Response,
  ) {
    const { id, password, newPassword } = dto;

    const foundUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('No user found!');
    }

    const compareSuccess = await this.comparePasswords({
      password,
      hash: foundUser.hashedPassword,
    });

    if (!compareSuccess) {
      throw new BadRequestException('Wrong password!');
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await this.prisma.user.update({
      where: { id: foundUser.id },
      data: { hashedPassword },
    });

    return res.send({ message: 'Password Change succefully' });
  }

  // SignOut
  async signout(req: Request, res: Response) {
    res.clearCookie('token');

    return res.send({ message: 'Logged out succefully' });
  }

  // hashPassword
  async hashPassword(password: string) {
    const saltOrRounds = 10;

    return await bcrypt.hash(password, saltOrRounds);
  }

  // Compare Password
  async comparePasswords(args: { hash: string; password: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  // Sign Token
  async signToken(args: { userId: string; email: string }) {
    const payload = {
      id: args.userId,
      email: args.email,
    };

    const token = await this.jwt.signAsync(payload, {
      secret: jwtSecret,
    });

    return token;
  }
}
