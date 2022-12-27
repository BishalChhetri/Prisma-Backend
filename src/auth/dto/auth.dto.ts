import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  IsBoolean,
} from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Name has to be more than 2 chars' })
  public name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password has to be at between 3 and 20 chars' })
  public password: string;
}

export class AuthDtoSignin {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password has to be at between 3 and 20 chars' })
  public password: string;
}

export class AuthDtoUpdatePassword {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password has to be at between 3 and 20 chars' })
  public password: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: 'New Password has to be at between 3 and 20 chars',
  })
  public newPassword: string;
}

export class TaskDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Title has to be more than 2 chars' })
  public title: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 100, { message: 'Description has to be more than 8 chars' })
  public description: string;
}

export class TaskUpdate {
  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsBoolean()
  public isCompleted: boolean;
}
