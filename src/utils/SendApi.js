import configs from './config.json';
import {UserApi} from "./UserApi";
import {Api} from './Api';


export class SendApi {
    static send = async (data, response, error) => {
        await Api.post(`${configs.send}/${data}`, {}, response, UserApi.getAuthorizedHeader(), error);
    }

    static sendAll = async (response, error) => {
        await Api.post(`${configs.send}`, {}, response, UserApi.getAuthorizedHeader(), error);
    }
}