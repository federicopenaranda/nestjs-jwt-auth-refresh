import { IsEmail } from 'class-validator';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(5)
    password: string;

}