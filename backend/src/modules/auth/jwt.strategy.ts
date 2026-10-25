import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { resolveRole } from '../../common/admin.util'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
    })
  }

  async validate(payload: { sub: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) throw new UnauthorizedException()
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: resolveRole(user.email),
    }
  }
}