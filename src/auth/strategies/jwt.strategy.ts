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
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    console.log(configService.get('JWT_SECRET'));
    console.log(this.configService.get('JWT_SECRET'));
  }

  async validate(payload: any) {
    console.log(payload);
    return await this.usersService.findUserById(payload.sub);
  }
}
