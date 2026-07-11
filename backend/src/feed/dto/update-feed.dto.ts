import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedDto } from './create-feed.dto.js';

export class UpdateFeedDto extends PartialType(CreateFeedDto) {}
