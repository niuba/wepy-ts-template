import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class Home extends wepy.page {
  public services: IServices;
  public data = {
    companys: [],
  };
  public onLoad() {
    this.services = getServices(this);
  }
  public async onShow() {
    if (this.services.authService.canActivate()) {
      wepy.showLoading({
        title: "加载中...",
        mask: true,
      });
    }
  }
}
