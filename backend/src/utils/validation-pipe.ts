import { PipeTransform, BadRequestException } from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import { ResponseCode, ResponseHelper } from './response-helper';

export class IdValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!isUuid(value)) {
      throw new BadRequestException(
        ResponseHelper.error(
          ResponseCode.INVALID_REQUEST_DATA,
          undefined,
          'Invalid ID',
        ),
      );
    }
    return value;
  }
}
