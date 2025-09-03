import {IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator'
export class CreateMailDto {
    @IsEmail()
    @IsNotEmpty()
    to: string;

    @IsString()
    @IsNotEmpty()
    subject : string;

    @IsString()
    @IsOptional()
    text?: string;

    @IsOptional()
    attachments?:{
        filename: string;
        path: string
    }[];
}
