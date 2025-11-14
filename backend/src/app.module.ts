import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConcertsModule } from './concerts/concerts.module';

@Module({
  imports: [ConcertsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
