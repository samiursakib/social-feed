import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'First name must be a text string' })
  @IsNotEmpty({ message: 'First name is required' })
  @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
  firstName: string;

  @IsString({ message: 'Last name must be a text string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
  lastName: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @Length(8, 50, {
    message: 'Password must be between 8 and 50 characters long',
  })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/[0-9]/, { message: 'Password must contain at least one digit' })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least one special character',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Please confirm your password' })
  repeatPassword: string;
}
