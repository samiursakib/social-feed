import { PartialType } from '@nestjs/mapped-types';
import { CreateReplyDto } from './create-reply.dto.js';

export class UpdateReplyDto extends PartialType(CreateReplyDto) {}
