import {Api} from "./Api";
import configs from "./config.json";


export class CaptchaApi{
    static get = async ( response, error) => {
        await Api.get(`captcha/api/math`, null, response, configs.requestHeader, error);
    }
}