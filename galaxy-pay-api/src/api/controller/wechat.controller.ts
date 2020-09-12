import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { WeChatAppletPayService } from "src/pay/module/wechat/service/applet.pay.service";
import { WeChatJSAPIPayService } from "src/pay/module/wechat/service/jsapi.pay.service";
import { WeChatNativePayService } from "src/pay/module/wechat/service/native.pay.service";
import { WeChatWapPayService } from "src/pay/module/wechat/service/wap.pay.service";
import { WeChatMicroPayService } from "src/pay/module/wechat/service/micro.pay.service";
import { WeChatAppPayService } from "src/pay/module/wechat/service/app.pay.service";
import { WechatPayDto } from "src/common/dtos/pay.dto";
import { ApiWechatService } from './service/api.wechat.service';
import { PayConfig } from "src/common/decorator/pay.config.decorator";
import { WechatConfig } from "src/pay/module/wechat/interfaces/base.interface";
import { WeChatTradeType } from "src/pay/module/wechat/enums/trade-type.enum";
import { PayGuard } from "src/common/guard/pay.guard";

@Controller("wechat")
@UseGuards(PayGuard)
export class WechatController {
    constructor(
        private readonly wechatAppletPayService: WeChatAppletPayService,
        private readonly wechatJSAPIPayService: WeChatJSAPIPayService,
        private readonly wechatNativePayService: WeChatNativePayService,
        private readonly wechatWapPayService: WeChatWapPayService,
        private readonly wechatMicroPayService: WeChatMicroPayService,
        private readonly wechatAppPayService: WeChatAppPayService,
        private readonly apiWechatSerice: ApiWechatService,
    ) {}
    

    /**
     * 微信小程序支付
     * @param param 
     * @param body 详情见WeChatAppletPayService接口
     */
    @Post("applet")
    async appletpay(@Body() body: WechatPayDto,  @PayConfig() payConfig: WechatConfig) {
        await this.apiWechatSerice.generateWechatOrder(body, payConfig);
        const payBody = {
            trade_type: WeChatTradeType.APP,
            notify_url: payConfig.notify_url,
            body: body.body,
            out_trade_no: body.out_trade_no,
            total_fee: body.money,
            spbill_create_ip: "",
        }
        const result = await this.wechatAppletPayService.pay(payConfig, payBody);
        return result
    }

    /**
     * 微信APP支付
     * @param param 
     * @param body 详情见WeChatAppletPayService接口
     */
    @Post("app")
    async app(@Body() body: WechatPayDto,  @PayConfig() payConfig: WechatConfig) {
        await this.apiWechatSerice.generateWechatOrder(body, payConfig);
        const payBody = {
            trade_type: WeChatTradeType.APP,
            notify_url: body.notify_url ? body.notify_url : payConfig.notify_url,
            body: body.body,
            out_trade_no: body.out_trade_no,
            total_fee: body.money,
            spbill_create_ip: "",
        }
        const result = await this.wechatAppPayService.pay(payConfig, payBody);
        return result
    }

    /**
     * 微信jsapi 支付
     * @param param 
     * @param body 
     */
    @Post("jsapi")
    async jsapi(@Body() body: WechatPayDto,  @PayConfig() payConfig: WechatConfig) {
        await this.apiWechatSerice.generateWechatOrder(body, payConfig);
        const payBody = {
            trade_type: WeChatTradeType.JSAPI,
            notify_url: payConfig.notify_url,
            body: body.body,
            out_trade_no: body.out_trade_no,
            total_fee: body.money,
            spbill_create_ip: "",
        }
        const result = await this.wechatJSAPIPayService.pay(payConfig, payBody);
        return result
    }

    /**
     * 微信扫码支付
     * @param param 
     * @param body 
     */
    @Post("native")
    async native(@Body() body: WechatPayDto,  @PayConfig() payConfig: WechatConfig) {
        await this.apiWechatSerice.generateWechatOrder(body, payConfig);
        const payBody = {
            trade_type: WeChatTradeType.NATIVE,
            notify_url: payConfig.notify_url,
            body: body.body,
            out_trade_no: body.out_trade_no,
            total_fee: body.money,
            spbill_create_ip: "",
        }
        const result = await this.wechatNativePayService.pay(payConfig, payBody);
        return result
    }

    /**
     * 微信h5支付
     * @param param 
     * @param body 
     */
    @Post("h5")
    async h5pay(@Body() body: WechatPayDto,  @PayConfig() payConfig: WechatConfig) {
        await this.apiWechatSerice.generateWechatOrder(body, payConfig);
        const payBody = {
            trade_type: WeChatTradeType.MWEB,
            notify_url: payConfig.notify_url,
            body: body.body,
            out_trade_no: body.out_trade_no,
            total_fee: body.money,
            spbill_create_ip: "",
        }
        const result = await this.wechatNativePayService.pay(payConfig, payBody);
        return result
    }

    /**
     * 付款码支付类
     * @param param 
     * @param data 
     */
    @Post("micro")
    async micro(@Body() body: WechatPayDto,  @PayConfig() payConfig: WechatConfig) {
        await this.apiWechatSerice.generateWechatOrder(body, payConfig);
        const payBody = {
            trade_type: WeChatTradeType.MWEB,
            notify_url: payConfig.notify_url,
            body: body.body,
            out_trade_no: body.out_trade_no,
            total_fee: body.money,
            auth_code: '',
            spbill_create_ip: "",
        }
        const result = await this.wechatMicroPayService.pay(payConfig, payBody);
        return result
    }
}