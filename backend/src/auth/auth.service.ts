import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';
import { LoginDto } from './dto/login.dto.js';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import { JwtPayload } from './dto/jwt-payload.js';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
    res: Response,
  ): Promise<{ success: boolean; message: string; data: string }> {
    const { email, password } = loginDto;
    const user = await this.userService.findOne({ email });
    if (!user) throw new UnauthorizedException('User not found');
    const passwordMatched = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatched)
      throw new UnauthorizedException('Password did not match');

    const payload = { sub: user.id, email };
    const accessToken = await this.generateJwtToken(payload, 'accessToken');
    const refreshToken = await this.generateJwtToken(payload, 'refreshToken');
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userService.update(user.id, {
      hashedRefreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return {
      success: true,
      message: 'Logged in successfully',
      data: accessToken,
    };
  }

  async logout(id: string, res: Response) {
    await this.userService.update(id, { hashedRefreshToken: null });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  async generateJwtToken(
    payload: JwtPayload,
    purpose: 'accessToken' | 'refreshToken' = 'accessToken',
  ): Promise<string> {
    const forAccessToken = purpose === 'accessToken';
    const token = await this.jwtService.signAsync(payload, {
      secret: forAccessToken
        ? process.env.JWT_ACCESS_TOKEN_SECRET
        : process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: forAccessToken ? '15m' : '7d',
    });
    return token;
  }

  async refresh(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findOne({ id: payload.sub });
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newPayload = { sub: user.id, email: user.email };
    const newAccessToken = await this.generateJwtToken(newPayload);
    return { success: true, data: newAccessToken };
  }
}
