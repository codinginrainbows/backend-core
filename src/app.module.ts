import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { InvitationsModule } from './invitations/invitations.module';
import { MailerModule } from './mailer/mailer.module';
import { WorkersModule } from './workers/workers.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    CompaniesModule,
    AuthModule,
    InvitationsModule,
    MailerModule,
    WorkersModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
