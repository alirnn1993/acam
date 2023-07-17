import configs from './config.json';
import {UserApi} from "./UserApi";
import {Api} from './Api';

export class CameraApi {
    static getAll = async (response, error) => {
        await Api.get(`${configs.camera.base}`, null, response, UserApi.getAuthorizedHeader(), error);
    }



    static getData=async (response,error)=>{
        await Api.get(`${configs.camera.data}`,null,response,UserApi.getAuthorizedHeader,error);
    }
}