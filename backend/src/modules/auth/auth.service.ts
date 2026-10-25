import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { resolveRole } from '../../common/admin.util'
import { PrismaService } from '../../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase()
    const existed = await this.prisma.user.findUnique({ where: { email } })
    if (existed?.password) throw new ConflictException('Email đã được đăng ký')

    const password = await bcrypt.hash(dto.password, 10)

    // Nếu email đã có (tạo từ đơn hàng, chưa có mật khẩu) thì bổ sung mật khẩu
    const user = existed
      ? await this.prisma.user.update({
          where: { id: existed.id },
          data: { password, name: existed.name ?? dto.name },
        })
      : await this.prisma.user.create({
          data: { email, name: dto.name, password },
        })

    return this.buildAuthResponse(user)
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase()
    const user = await this.prisma.user.findUnique({ where: { email } })

    const ok = user?.password ? await bcrypt.compare(dto.password, user.password) : false

    await this.prisma.loginLog.create({
      data: { userId: user?.id ?? null, email, success: ok },
    })

    if (!user || !ok) throw new UnauthorizedException('Sai email hoặc mật khẩu')
    return this.buildAuthResponse(user)
  }

  private buildAuthResponse(user: { id: string; email: string; name: string | null }) {
    const role = resolveRole(user.email)
    const accessToken = this.jwt.sign({ sub: user.id, email: user.email, role })
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, role },
    }
  }
}
