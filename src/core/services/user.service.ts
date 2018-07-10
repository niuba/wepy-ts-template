import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import wepy from "wepy";
import { BACKEND_URL, TOKEN_NAME, WX_TYPE } from "../constant";

export interface IUser {
  id?: number;
}

export class UserService {
  public token: string;
  public user: IUser;
  public getTokenByCode(code: string): Observable<string> {
    return ObservableFrom(wepy.request({
      url: BACKEND_URL + "/myuser/get_token_by_code/",
      data: {
        code,
        type: WX_TYPE,
      },
      method: "GET",
    })).pipe(
      map((response) => {
        wepy.setStorageSync(TOKEN_NAME, response.data.token);
        this.token = response.data.token;
        this.user = response.data.user;
        return response.data.token;
      }),
    );
  }
  public verify(token): Observable<string> {
    return ObservableFrom(wepy.request({
      url: `${BACKEND_URL}/api-token-verify/`,
      data: {
        token,
      },
      method: "POST",
    })).pipe(
      map((response) => {
        wepy.setStorageSync(TOKEN_NAME, response.data.token);
        this.token = response.data.token;
        this.user = response.data.user;
        this.refresh(token).subscribe();
        return "success";
      }),
      catchError((error) => {
        if (error.json().non_field_errors) {
          return ObservableOf("Login expired");
        } else {
          return ObservableOf("network error");
        }
      }),
    );
  }
  public refresh(token): Observable<string> {
    return ObservableFrom(wepy.request({
      url: `${BACKEND_URL}/api-token-refresh/`,
      data: {
        token,
      },
      method: "POST",
    })).pipe(
      map((response) => {
        wepy.setStorageSync(TOKEN_NAME, response.data.token);
        this.token = response.data.token;
        this.user = response.data.user;
        return "success";
      }),
      catchError((error) => {
        if (error.json().non_field_errors) {
          return ObservableOf("Login expired");
        } else {
          return ObservableOf("network error");
        }
      }),
    );
  }
  public getToken(): Observable<string> {
    const token = wepy.getStorageSync(TOKEN_NAME);
    if (typeof (token) === "string") {
      return ObservableOf(wepy.getStorageSync(TOKEN_NAME));
    } else {
      return throwError(new Error("no token"));
    }
  }
  public getPhoneVerifyCode(phoneNumber: string): Observable<string> {
    return ObservableFrom(wepy.request({
      url: BACKEND_URL + "/phoneverify/send_code/",
      data: {
        phone_number: phoneNumber,
        expires: "60",
      },
      method: "POST",
    })).pipe(
      map((response) => {
        return response.data.code;
      }),
    );
  }
  public checkPhoneVerifyCode(phoneNumber: string, code: string): Observable<string> {
    return ObservableFrom(wepy.request({
      url: BACKEND_URL + "/phoneverify/check_code/",
      data: {
        phone_number: phoneNumber,
        code,
      },
      method: "POST",
    })).pipe(
      map((response) => {
        return response.data.code;
      }),
    );
  }
}
