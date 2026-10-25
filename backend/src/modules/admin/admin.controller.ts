import { Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { Roles, RolesGuard } from '../../common/guards/roles.guard'
import { resolveRole } from '../../common/admin.util'
import { PrismaService } from '../../prisma/prisma.service'

const publicFields = {
  id: true,
  email: true,
  name: true,
  loyaltyPoints: true,
  createdAt: true,
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  // Danh sách mọi người đã đăng ký + thống kê đăng nhập
  @Get('users')
  async list() {
    const users = await this.prisma.user.findMany({
      select: publicFields,
      orderBy: { createdAt: 'desc' },
    })

    const success = await this.prisma.loginLog.groupBy({
      by: ['userId'],
      where: { success: true, userId: { not: null } },
      _count: { _all: true },
      _max: { createdAt: true },
    })
    const failed = await this.prisma.loginLog.groupBy({
      by: ['userId'],
      where: { success: false, userId: { not: null } },
      _count: { _all: true },
    })

    const okMap = new Map(success.map((s) => [s.userId, s]))
    const failMap = new Map(failed.map((f) => [f.userId, f._count._all]))

    return {
      total: users.length,
      users: users.map((u) => ({
        ...u,
        role: resolveRole(u.email),
        loginCount: okMap.get(u.id)?._count._all ?? 0,
        lastLoginAt: okMap.get(u.id)?._max.createdAt ?? null,
        failedLoginCount: failMap.get(u.id) ?? 0,
      })),
    }
  }

  @Get('users/:id')
  async detail(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: publicFields })
    if (!user) throw new NotFoundException('Không tìm thấy người dùng')

    const logs = await this.prisma.loginLog.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return { ...user, role: resolveRole(user.email), recentLogins: logs }
  }

  // Lịch sử đăng nhập toàn hệ thống (cả lần thất bại)
  @Get('login-logs')
  async logs(@Query('limit') limit = '100') {
    const take = Math.min(Number(limit) || 100, 500)
    return this.prisma.loginLog.findMany({
      orderBy: { createdAt: 'desc' },
      take,
    })
  }
}