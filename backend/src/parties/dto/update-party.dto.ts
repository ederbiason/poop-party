import { PartialType } from '@nestjs/mapped-types';
import { CreatePartyDto } from './create-party.dto';

export class UpdatePartyDto extends PartialType(CreatePartyDto) {
    // os unicos campos que vao poder ser alterados sera o "members", tanto para adicionar mais membro quando para atualizar o numero de cagadas individual, o campo de metas, onde poderá existir mais metas e também o campo de histórico de cagadas, que será atualizado sempre que houver um registro
}
