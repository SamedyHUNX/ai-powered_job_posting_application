import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  fullName: string;

  @Expose()
  name: string;

  @Expose()
  imageUrl: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
