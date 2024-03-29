import { PlayerDTO, UserDTO } from '../user/user.model';
import { WordpackDTO } from '../wordpack/wordpack.model';

export class RoomDTO {
  id?: string | undefined | null = null;
  title: string | undefined | null = null;
  admin?: UserDTO | undefined | null = null;
  password?: string | undefined | null = null;
  maxPlayers: number | undefined | null = null;
  playerList?: Array<PlayerDTO> | undefined | null = null;
  wordpack: WordpackDTO | undefined | null = null;
  drawer?: UserDTO | undefined | null = null;
  rounds?: number | undefined | null = null;
  currentWord?: string | undefined | null = null;
}
