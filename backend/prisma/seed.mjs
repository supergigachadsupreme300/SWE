import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'


const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Đang nạp dữ liệu mẫu (Seed Data) vào cơ sở dữ liệu BrewLite...')

  // 1. Tạo User mẫu
  const user = await prisma.user.upsert({
    where: { email: 'customer@brewlite.com' },
    update: {},
    create: {
      email: 'customer@brewlite.com',
      name: 'Hoàng Long (Khách hàng mẫu)',
      loyaltyPoints: 120,
    },
  })
  console.log(`✓ Đã tạo/cập nhật User: ${user.name} (${user.id})`)

  // 2. Tạo danh mục sản phẩm (Đồ uống)
  const products = [
    {
      id: 'prod_macchiato_01',
      name: 'Caramel Macchiato Đặc Biệt',
      description: 'Cà phê Espresso hảo hạng kết hợp lớp bọt sữa béo ngậy và sốt caramel thơm lừng.',
      imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=150&auto=format&fit=crop&q=80',
      price: 49000,
      stock: 50,
    },
    {
      id: 'prod_coldbrew_02',
      name: 'Cold Brew Cam Sả Thượng Hạng',
      description: 'Cà phê ủ lạnh 18 giờ kết hợp nước cốt cam vàng và hương sả tươi mát.',
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=150&auto=format&fit=crop&q=80',
      price: 55000,
      stock: 40,
    },
    {
      id: 'prod_muoi_03',
      name: 'Cà Phê Muối Kem Béo',
      description: 'Vị cà phê đậm đà hòa quyện cùng lớp kem muối béo mặn đặc trưng xứ Huế.',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150&auto=format&fit=crop&q=80',
      price: 39000,
      stock: 60,
    },
    {
      id: 'prod_bacxiu_04',
      name: 'Bạc Xỉu Sữa Tươi 3 Tầng',
      description: 'Sự kết hợp hoàn hảo giữa sữa đặc, sữa tươi thanh trùng và cà phê pha phin truyền thống.',
      imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=150&auto=format&fit=crop&q=80',
      price: 35000,
      stock: 45,
    },
    {
      id: 'prod_tradao_05',
      name: 'Trà Đào Cam Sả Tươi',
      description: 'Trà thảo mộc thơm mát kết hợp miếng đào giòn ngọt và cam sả sảng khoái.',
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=150&auto=format&fit=crop&q=80',
      price: 42000,
      stock: 35,
    },
    
  ]

  for (const prod of products) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: { stock: prod.stock, price: prod.price },
      create: prod,
    })
  }
  console.log(`✓ Đã nạp ${products.length} sản phẩm đồ uống vào bảng Product`)

  // 3. Tạo một Order mẫu ở trạng thái PENDING
  const existingOrder = await prisma.order.findFirst({
    where: { userId: user.id },
  })

  if (!existingOrder) {
    const order = await prisma.order.create({
      data: {
        id: 'BL-8888',
        userId: user.id,
        total: 153000,
        status: 'PENDING',
        items: {
          create: [
            {
              productId: 'prod_macchiato_01',
              quantity: 2,
              size: 'M',
              unitPrice: 49000,
              lineTotal: 98000,
            },
            {
              productId: 'prod_coldbrew_02',
              quantity: 1,
              size: 'L',
              unitPrice: 55000,
              lineTotal: 55000,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    })
    console.log(`✓ Đã tạo Đơn hàng mẫu: ${order.id} (Trạng thái: ${order.status}, Tổng tiền: ${order.total}đ, gồm ${order.items.length} món)`)
  } else {
    console.log(`ℹ Đã có đơn hàng mẫu trong hệ thống (ID: ${existingOrder.id})`)
  }
   console.log('\n🎉 Hoàn thành nạp dữ liệu mẫu!')
 // 4. Tạo tài khoản admin (email phải trùng ADMIN_EMAILS trong .env)
   const adminEmail = (process.env.ADMIN_EMAILS ?? 'admin@example.com')
    .split(',')[0]
    .trim()
    .toLowerCase()
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      password: await bcrypt.hash('Admin@123', 10),
    },
  })
  console.log(`✓ Đã tạo/cập nhật Admin: ${admin.email}`)
}

await prisma.user.upsert({
  where: { email: 'admin@example.com' },
  update: {},
  create: {
    email: 'admin@example.com',
    name: 'Admin',
    password: await bcrypt.hash('Admin@123', 10),
  },
})
await prisma.$disconnect()

main()
  .catch((e) => {
    console.error('Lỗi khi nạp seed data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
