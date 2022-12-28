import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Name has to be more than 2 chars' })
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password has to be at between 3 and 20 chars' })
  public password: string;
}

export class AuthDtoSignin {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password has to be at between 3 and 20 chars' })
  public password: string;
}

export class AuthDtoUpdatePassword {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password has to be at between 3 and 20 chars' })
  public password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: 'New Password has to be at between 3 and 20 chars',
  })
  public newPassword: string;
}

export class TaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Title has to be more than 2 chars' })
  public title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 100, { message: 'Description has to be more than 8 chars' })
  public description: string;
}

export class TaskUpdate {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsBoolean()
  public isCompleted: boolean;
}
