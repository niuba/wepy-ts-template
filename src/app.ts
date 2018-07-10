import wepy from "wepy";
import "wepy-async-function";
import { AuthService } from "./core/services/auth.service";
import { UserService } from "./core/services/user.service";

export interface IServices {
  userService: UserService;
  authService: AuthService;
}

export default class SirenApp extends wepy.app {
  public config = {
    pages: [
      "pages/index/index",
      "pages/home/home",
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "NIUBA",
      navigationBarTextStyle: "black",
    },
  };
  public globalData: {
    services: IServices,
  } = {
      services: {
        userService: new UserService(),
        authService: new AuthService(),
      },
    };
  constructor() {
    super();
    this.use("promisify");
  }

  public async onShow() {

  }
  public onHide() {

  }
  public onError(msg) {
    console.log(msg);
  }
}
