import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signSingleToken(
    userId: string,
    expiresIn: number,
    payload?: any,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn,
      },
    );
  }

  public async generateBothTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signSingleToken(
        user.id,
        this.configService.get('JWT_ACCESS_TOKEN_TTL'),
        {
          email: user.email,
        },
      ),
      this.signSingleToken(
        user.id,
        this.configService.get('JWT_REFRESH_TOKEN_TTL'),
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
