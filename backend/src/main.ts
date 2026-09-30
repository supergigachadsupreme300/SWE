import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  await app.listen(8000)
  console.log('Backend listening on http://localhost:8000')
}

bootstrap()
