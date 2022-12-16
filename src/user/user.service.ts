import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

    private users: User[] = [
        {
            userId: 1,
            name: 'Adam1',
            email: 'adam1@gmail.com',
            password: '123456'
        },
        {
            userId: 2,
            name: 'Adam2',
            email: 'adam2@gmail.com',
            password: '123456'
        },
        {
            userId: 3,
            name: 'Adam3',
            email: 'adam3@gmail.com',
            password: '123456'
        },
        {
            userId: 4,
            name: 'Adam4',
            email: 'adam4@gmail.com',
            password: '123456'
        }
    ];

    findUserByEmail(email: string): User {
        const user = this.users.find( (user) => user.email === email );
        if (!user) throw new Error('User not found.');
        return user;
    }

    findUserById(userId: number): User {
        const user = this.users.find( (user) => user.userId === userId );
        if (!user) throw new Error('User not found.');
        return user;
    }

}
