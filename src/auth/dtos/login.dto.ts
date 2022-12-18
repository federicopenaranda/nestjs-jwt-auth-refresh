import { IsNotEmpty } from 'class-validator';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(5)
    password: string;

}