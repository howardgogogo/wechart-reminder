import { Injectable, Inject } from '@nestjs/common';

interface WeComConfig {
  corpId: string;
  agentId: string;
  agentSecret: string;
}

@Injectable()
export class WechatEnterpriseService {
  private config: WeComConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(
    @Inject('WECOM_CORP_ID') corpId: string,
    @Inject('WECOM_AGENT_ID') agentId: string,
    @Inject('WECOM_AGENT_SECRET') agentSecret: string,
  ) {
    this.config = { corpId, agentId, agentSecret };
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${this.config.corpId}&corpsecret=${this.config.agentSecret}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.errcode !== 0) {
        throw new Error(`Failed to get access token: ${data.errmsg}`);
      }

      this.accessToken = data.access_token;
      // Token typically expires in 7200 seconds, refresh 5 minutes early
      this.tokenExpiry = new Date(Date.now() + (data.expires_in - 300) * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  async sendMessage(toUser: string, message: string): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${token}`;

      const payload = {
        touser: toUser,
        msgtype: 'text',
        agentid: this.config.agentId,
        text: {
          content: message,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.errcode !== 0) {
        console.error(`Failed to send message: ${result.errmsg}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  async sendMessageToAll(message: string): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${token}`;

      const payload = {
        touser: '@all',
        msgtype: 'text',
        agentid: this.config.agentId,
        text: {
          content: message,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      return result.errcode === 0;
    } catch (error) {
      console.error('Error sending broadcast message:', error);
      return false;
    }
  }
}
