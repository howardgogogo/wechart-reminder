import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register or get user by openid' })
  register(@Body() body: { openid: string; nickname?: string }) {
    return this.userService.findOrCreate(body.openid, body.nickname);
  }

  @Get()
  @ApiOperation({ summary: 'Get user by openid' })
  findByOpenid(@Query('openid') openid: string) {
    return this.userService.findByOpenid(openid);
  }
}
