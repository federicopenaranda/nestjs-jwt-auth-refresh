import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

    private users: User[] = [
        {
            userId: 1,
            name: 'user1',
            email: 'user1@gmail.com',
            password: '123456'
        },
        {
            userId: 2,
            name: 'user2',
            email: 'user2@gmail.com',
            password: '123456'
        },
        {
            userId: 3,
            name: 'user3',
            email: 'user3@gmail.com',
            password: '123456'
        },
        {
            userId: 4,
            name: 'user4',
            email: 'user4@gmail.com',
            password: '123456'
        },
        {
            userId: 5,
            name: 'user5',
            email: 'user5@gmail.com',
            password: '123456'
        }
    ];

    findUserById(userId: number): User {
        const user = this.users.find( (user) => user.userId === userId );
        if (!user) throw new Error('User not found');
        return user;
    }

    findUserByEmail(email: string): User {
        const user = this.users.find( (user) => user.email === email );
        if (!user) throw new Error('User not found');
        return user;
    }

}
