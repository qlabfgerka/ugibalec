import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenDTO } from 'src/app/models/token/token.model';
import { UserDTO } from 'src/app/models/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly hostname: string = 'http://localhost:3000';

  constructor(private readonly httpClient: HttpClient) {}

  public login(user: UserDTO): Observable<TokenDTO> {
    return this.httpClient.post<TokenDTO>(`${this.hostname}/auth/login`, user);
  }

  public register(user: UserDTO): Observable<UserDTO> {
    return this.httpClient.post<UserDTO>(`${this.hostname}/auth/register`, {
      user,
    });
  }

  public saveTokens(tokens: TokenDTO): boolean {
    localStorage.setItem('JWT_TOKEN', tokens.accessToken);
    localStorage.setItem('REFRESH_TOKEN', tokens.refreshToken);

    return true;
  }
}
