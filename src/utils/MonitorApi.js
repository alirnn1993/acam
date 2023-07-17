import configs from './config.json';
import {UserApi} from "./UserApi";
import {Api} from './Api';

export class MonitorApi {
    static getMonitor =async (response,error)=>{
        await Api.get(`${configs.monitor.base}`,null,response,UserApi.getAuthorizedHeader(),error);
    }

    static getTimeConfiguration=async (response,error)=>{
        await Api.get(`${configs.monitor.time}`,null,response,UserApi.getAuthorizedHeader(),error);
    }

    static getNetworkConfiguration=async (response,error)=>{
        await Api.get(`${configs.monitor.network}`,null,response,UserApi.getAuthorizedHeader(),error);
    }

    static getUptime=async (response,error)=>{
        await Api.get(`${configs.monitor.uptime}`,null,response,UserApi.getAuthorizedHeader(),error);
    }
}