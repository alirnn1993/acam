import configs from './config.json';
import {UserApi} from "./UserApi";
import {Api} from './Api';

export class LogApi{

    static getLast=async (response,error)=>{
        await Api.get(`${configs.log}`, null, response, UserApi.getAuthorizedHeader(), error);

    }

    static get=async (data,response,error)=>{
        await Api.get(`${configs.log}`, data, response, UserApi.getAuthorizedHeader(), error);

    }
    static getState=async (data,response,error)=>{
        await Api.get(`${configs.log}`,data,response,UserApi.getAuthorizedHeader(),error);
    }

}