// src/users/users.service.ts
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
 import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
 import * as appleSigninAuth from 'apple-signin-auth';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService, // ✅ Inject HttpService
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  // ✅ NEW: Login with Google
  async loginWithGoogle(accessToken: string): Promise<User> {
    try {
      const googleUserInfo$ = this.httpService.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const { data } = await lastValueFrom(googleUserInfo$);
      const { email, name, picture } = data;

      if (!email) {
        throw new HttpException('Google account does not have an email', 400);
      }

      let user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        user = this.userRepository.create({
          email,
          FullName: name,
          profilePicture: picture,
          userType: 'Google',
          isVerified: true,
          isActive: true,
          createdAt: new Date(),
        });

        await this.userRepository.save(user);
      }

      user.lastLogin = new Date();
      await this.userRepository.save(user);

      return user;
    } catch (err) {
      console.error('Google login error:', err);
      throw new HttpException('Failed to login with Google', 401);
    }
  }
  async loginWithFacebook(accessToken: string): Promise<User> {
  try {
    // Facebook Graph API to fetch user info
    const fbUserInfo$ = this.httpService.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`,
    );

    const { data } = await lastValueFrom(fbUserInfo$);

    const { email, name, picture } = data;

    if (!email) {
      throw new HttpException('Facebook account does not have an email', 400);
    }

    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      user = this.userRepository.create({
        email,
        FullName: name,
        profilePicture: picture?.data?.url || '',
        userType: 'Facebook',
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
      });

      await this.userRepository.save(user);
    }

    user.lastLogin = new Date();
    await this.userRepository.save(user);

    return user;
  } catch (err) {
    console.error('Facebook login error:', err);
    throw new HttpException('Failed to login with Facebook', 401);
  }
}
async loginWithApple(idToken: string): Promise<User> {
  try {
    const appleUser = await appleSigninAuth.verifyIdToken(idToken, {
      audience: 'com.yourcompany.yourapp', // Must match clientId
      ignoreExpiration: true,
    });

    const email = appleUser.email;
    const name = 'Apple User';

    if (!email) {
      throw new HttpException('Apple account does not have an email', 400);
    }

    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      user = this.userRepository.create({
        email,
        FullName: name,
        userType: 'Apple',
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
      });

      await this.userRepository.save(user);
    }

    user.lastLogin = new Date();
    await this.userRepository.save(user);

    return user;
  } catch (err) {
    console.error('Apple login error:', err);
    throw new HttpException('Apple login failed', 401);
  }
}
}

