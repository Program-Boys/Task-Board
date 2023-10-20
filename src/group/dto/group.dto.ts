import { OmitType } from '@nestjs/swagger';
import {
  IsInstance,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskDTO } from 'src/tasks/dto/tasks.dto';

export class GroupDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  groupName: string;

  tasks?: TaskDTO[];
}

export class UpdateGroupDTO extends OmitType(GroupDTO, ['tasks']) {}
