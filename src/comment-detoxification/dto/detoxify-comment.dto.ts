import { IsNotEmpty, IsString } from 'class-validator';

export class DetoxifyCommentDto {
  @IsNotEmpty()
  @IsString()
  comment: string;
}
