import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_URL',
      useFactory: () => process.env.DATABASE_URL || 'postgresql://localhost:5432/wechat_reminder',
    },
    {
      provide: 'WECOM_CORP_ID',
      useFactory: () => process.env.WECOM_CORP_ID || '',
    },
    {
      provide: 'WECOM_AGENT_ID',
      useFactory: () => process.env.WECOM_AGENT_ID || '',
    },
    {
      provide: 'WECOM_AGENT_SECRET',
      useFactory: () => process.env.WECOM_AGENT_SECRET || '',
    },
  ],
  exports: ['DATABASE_URL', 'WECOM_CORP_ID', 'WECOM_AGENT_ID', 'WECOM_AGENT_SECRET'],
})
export class ConfigModule {}
