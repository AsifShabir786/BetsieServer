// src/users/users.service.ts
import { Injectable, HttpException,NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
 import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
 import * as appleSigninAuth from 'apple-signin-auth';
import { JwtService } from '@nestjs/jwt';
// import bcrypt from 'bcrypt';
import * as crypto from 'crypto'; // ✅ correct import
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt'; // ✅ CORRECT for CommonJS

@Injectable()
export class UsersService {
   constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService, // ✅ Add this
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  // user.service.ts
async updatePlayerName(id: number, playerName: string) {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  user.playerName = playerName;
  return await this.userRepository.save(user);
}

  async updateEmail(userId: number, newEmail: string): Promise<any> {
  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  user.email = newEmail;
  return this.userRepository.save(user);
}

  async requestAccountDeletion(email: string): Promise<string> {
  const user = await this.userRepository.findOne({ where: { email } });

  if (!user) {
    throw new HttpException('User not found', 404);
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

  user.deleteAccountToken = token;
  user.deleteTokenExpires = expires;
  await this.userRepository.save(user);

  const link = `https://betsie-web-xuen.vercel.app/confirmdelete/deleteAccount?token=${token}`;

  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or any SMTP config
    auth: {
      user: 'ehteshambutt58@gmail.com',
      pass: 'fbes darg ugbf gvou',
    },
  });

  await transporter.sendMail({
    from: 'Betsie Support',
    to: user.email,
    subject: 'Confirm Account Deletion',
    html: `<p>Click the link below to confirm deletion of your account:</p>
           <a href="${link}">${link}</a>`,
  });

  return 'Deletion email sent';
}
async confirmAccountDeletion(token: string): Promise<{ message: string }> {
  const user = await this.userRepository.findOne({
    where: { deleteAccountToken: token },
  });

  if (!user || user.deleteTokenExpires < new Date()) {
    throw new HttpException('Invalid or expired token', 400);
  }

  await this.userRepository.remove(user);
  return { message: 'Account deleted successfully' };
}


async loginWithEmailPassword(email: string, password: string): Promise<{ user: User; token: string }> {
  const user = await this.userRepository.findOne({ where: { email } });

  if (!user || !user.password) {
    throw new HttpException('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new HttpException('Invalid email or password', 401);
  }

  const token = this.jwtService.sign({
    id: user.id,
    email: user.email,
    userType: user.userType,
  });

  return { user, token };
}
async searchUsers(query: {
  id?: number;
  phoneNumber?: string;
  playerName?: string;
  email?: string;
}): Promise<User[]> {
  const { id, phoneNumber, playerName, email } = query;

  const qb = this.userRepository.createQueryBuilder('user');

  if (id) {
    qb.andWhere('user.id = :id', { id });
  }

  if (phoneNumber) {
    qb.andWhere('user.phoneNumber LIKE :phoneNumber', { phoneNumber: `%${phoneNumber}%` });
  }

  if (playerName) {
    qb.andWhere('user.playerName LIKE :playerName', { playerName: `%${playerName}%` });
  }

  if (email) {
    qb.andWhere('user.email LIKE :email', { email: `%${email}%` });
  }

  return qb.getMany();
}

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
async create(userData: Partial<User>): Promise<User> {
  const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });

  if (existingUser) {
    throw new HttpException('Email already exists', 400);
  }

  if (userData.password) {
    const salt = await bcrypt.genSalt();
    userData.password = await bcrypt.hash(userData.password, salt);
  }

  const user = this.userRepository.create(userData);
  return this.userRepository.save(user);
}



async requestPasswordReset(email: string): Promise<string> {
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) throw new HttpException('User not found', 404);

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await this.userRepository.save(user);

  const resetLink = `https://betsie-web-xuen.vercel.app/token/${token}`;

  // ✅ SEND EMAIL
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ehteshambutt58@gmail.com',  
      pass: 'fbes darg ugbf gvou', 
    },
  });

  await transporter.sendMail({
    from: '"Betsie Support" team@brimerventures.com',
    to: email,
    subject: 'Reset your password',
    html: `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });

  return 'Reset link sent to email';
}
async resetPassword(token: string, newPassword: string): Promise<string> {
  const user = await this.userRepository.findOne({
    where: { resetPasswordToken: token },
  });

  if (!user || user.resetTokenExpires < new Date()) {
    throw new HttpException('Invalid or expired token', 400);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = '';
  user.resetTokenExpires = new Date(0); // Clear the token and expiration
  await this.userRepository.save(user);

  return 'Password reset successful';
}
async loginWithGoogle(accessToken?: string, idToken?: string): Promise<{ user: User; token: string }> {
  try {
    let googleUserInfo: any;

    // Prefer accessToken, fallback to idToken
    if (accessToken) {
      const googleUserInfo$ = this.httpService.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const { data } = await lastValueFrom(googleUserInfo$);
      googleUserInfo = data;
    } else if (idToken) {
      // Decode idToken to get user info
      const decodedToken = await this.jwtService.decode(idToken) as any;
      googleUserInfo = decodedToken;
    } else {
      throw new HttpException('Missing Google token', 400);
    }

    const { email, name, picture } = googleUserInfo;

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

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      userType: user.userType,
    });

    return { user, token };
  } catch (err) {
    console.error('Google login error:', err);
    throw new HttpException('Failed to login with Google', 401);
  }
}

 
async loginWithFacebook(accessToken: string): Promise<{ user: User; token: string }> {
  try {
    const fbUserInfo$ = this.httpService.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`,
    );

    const { data } = await lastValueFrom(fbUserInfo$);
    const { email, name, picture } = data;

    if (!email) throw new HttpException('Facebook account does not have an email', 400);

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

    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return { user, token }; // ✅ Return token here
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

