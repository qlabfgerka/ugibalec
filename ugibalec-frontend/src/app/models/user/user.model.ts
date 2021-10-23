export class UserDTO {
  id?: string | undefined | null = null;
  username: string | undefined | null = null;
  nickname: string | undefined | null = null;
  email: string | undefined | null = null;
  password?: string | undefined | null = null;
  gamesPlayed: number | undefined | null = null;
  cumulativePoints: number | undefined | null = null;
  wins: number | undefined | null = null;
}
