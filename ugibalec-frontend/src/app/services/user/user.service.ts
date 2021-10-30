import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenDTO } from 'src/app/models/token/token.model';
import { UserDTO } from 'src/app/models/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly hostname: string = 'http://localhost:3000';

  constructor(private readonly httpClient: HttpClient) {}

  public getUser(id: string): Observable<UserDTO> {
    return this.httpClient.get<UserDTO>(`${this.hostname}/user/${id}`);
  }

  public changeNickname(nickname: string): Observable<UserDTO> {
    return this.httpClient.patch<UserDTO>(`${this.hostname}/user/update`, {
      nickname,
    });
  }
}
