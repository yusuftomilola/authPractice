import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HashingProvider } from './providers/hashing.provider';
import { BrcyptProvider } from './providers/bcrypt.provider';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.stratgey';
import { GenerateTokensProvider } from './providers/generateTokens.provider';
import jwtConfig from './config/jwtConfig';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_TTL'),
        },
      }),
    }),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BrcyptProvider,
    },
    JwtStrategy,
    LocalStrategy,
    GenerateTokensProvider,
  ],
  exports: [HashingProvider, AuthService],
})
export class AuthModule {}
