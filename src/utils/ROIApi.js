import {Api} from "./Api";
import configs from "./config.json";
import {UserApi} from "./UserApi";

export class ROIApi {

    static get = async (response, error) => {
        await Api.get(`${configs.roi}`, null, response, UserApi.getAuthorizedHeader(), error);
    }
    static set = async (data, response, error) => {
        await Api.post(`${configs.roi}`, data, response, UserApi.getAuthorizedHeader(), error);
    }
}