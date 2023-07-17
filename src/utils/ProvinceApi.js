import configs from './config.json';
import {UserApi} from "./UserApi";
import {Api} from './Api';

export class ProvinceApi {
    static getAll = async (response, error) => {
        await Api.get(`${configs.province}`, null, response, UserApi.getAuthorizedHeader(), error);
    }




}