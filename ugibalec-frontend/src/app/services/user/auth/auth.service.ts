import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenDTO } from 'src/app/models/token/token.model';
import { UserDTO } from 'src/app/models/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

  public logout(): Observable<void> {
    return this.httpClient.delete<void>(`${this.hostname}/auth/logout`);
  }

  public refreshToken(): Observable<TokenDTO> {
    const refreshToken = this.getRefreshToken();

    return this.httpClient
      .post<TokenDTO>(`${this.hostname}/auth/refreshToken`, {
        refreshToken,
      })
      .pipe(
        tap((tokens: TokenDTO) => {
          this.saveTokens(tokens);
        })
      );
  }

  public saveTokens(tokens: TokenDTO): boolean {
    localStorage.setItem('JWT_TOKEN', tokens.accessToken);
    localStorage.setItem('REFRESH_TOKEN', tokens.refreshToken);

    return true;
  }

  public getJWTToken(): string {
    return localStorage.getItem('JWT_TOKEN');
  }

  public deleteTokens(): void {
    localStorage.clear();
  }

  public get isLoggedIn(): boolean {
    return this.getJWTToken() !== '';
  }

  private getRefreshToken(): string {
    return localStorage.getItem('REFRESH_TOKEN');
  }
}
