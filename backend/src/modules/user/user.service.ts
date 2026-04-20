import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOrCreate(openid: string, nickname?: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { openid } });
    if (!user) {
      user = this.userRepository.create({ openid, nickname });
      user = await this.userRepository.save(user);
    }
    return user;
  }

  async findByOpenid(openid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { openid } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateEnterpriseId(openid: string, enterpriseId: string): Promise<User> {
    const user = await this.findOrCreate(openid);
    user.enterpriseId = enterpriseId;
    return this.userRepository.save(user);
  }
}
