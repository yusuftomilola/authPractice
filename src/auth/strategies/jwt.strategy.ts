import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FindUserProvider } from 'src/users/providers/findUser.provider';
import jwtConfig from '../config/jwtConfig';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // @Inject(jwtConfig.KEY)
    // private readonly jwtConfigurations: ConfigType<typeof jwtConfig>,
    private readonly configService: ConfigService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });

    console.log(
      'JWT Strategy initialized with secret:',
      process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    );
  }

  async validate(payload: any) {
    // console.log('JWT Strategy - Validating payload:', payload);
    // return await this.usersService.findUserById(payload.sub);

    try {
      const user = await this.usersService.findUserById(payload.sub);
      console.log(
        'JWT Strategy - Found user:',
        user ? `ID: ${user.id}` : 'NOT FOUND',
      );

      if (!user) {
        console.log('JWT Strategy - User not found or inactive');
        throw new UnauthorizedException('User not found or inactive');
      }

      return user;
    } catch (error) {
      console.log('JWT Strategy - Validation error:', error.message);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
