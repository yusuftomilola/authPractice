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
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigurations: ConfigType<typeof jwtConfig>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfigurations.secret,
      issuer: jwtConfigurations.issuer,
      audience: jwtConfigurations.audience,
    });
  }

  async validate(payload: any) {
    return await this.usersService.findUserById(payload.sub);
  }
}
