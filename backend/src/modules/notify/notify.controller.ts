import { Controller, Post, Param, Query, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotifyService } from './notify.service';
import { WechatEnterpriseService } from './wechat-enterprise.service';

@ApiTags('Notify')
@Controller('notify')
export class NotifyController {
  constructor(
    private readonly notifyService: NotifyService,
    private readonly wechatEnterpriseService: WechatEnterpriseService,
  ) {}

  @Get('test-send')
  @ApiOperation({ summary: 'Test send a message to user' })
  testSend(@Query('openid') openid: string, @Query('message') message: string) {
    return this.wechatEnterpriseService.sendMessage(openid, message || '测试消息').then((success) => ({
      success,
      message: success ? '发送成功' : '发送失败',
    }));
  }
}
