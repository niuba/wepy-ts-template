import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class Index extends wepy.page {
  public services: IServices;
  public onLoad() {
    this.services = getServices(this);
    wepy.showToast({
      title: "登陆中",
      icon: "loading",
      duration: 10000,
    });
    ObservableFrom(wepy.checkSession())
      .pipe(
        switchMap(() => this.services.userService.getToken()),
        catchError(() => {
          return ObservableFrom(wepy.login())
            .pipe(
              switchMap((res) => {
                if (res.code) {
                  // 发起网络请求
                  return this.services.userService.getTokenByCode(res.code);
                } else {
                  console.log("登录失败！" + res.errMsg);
                  return throwError("登录失败！" + res.errMsg);
                }
              }),
          );
        }),
        switchMap((token) => this.services.userService.verify(token)),
        switchMap((msg) => {
          if (msg === "success") {
            return this.services.authService.login();
          } else {
            return throwError("登录失败！" + msg);
          }
        }),
    )
      .subscribe((msg) => {
        wepy.redirectTo({
          url: this.services.authService.redirectUrl,
        });
      });

  }
  public async onShow() {
    //
  }
}
