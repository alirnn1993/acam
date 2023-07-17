import configs from './config.json';
import {UserApi} from "./UserApi";
import {Api} from './Api';

export class CommandApi{
    static hardReboot=async (response,error)=>{
        await Api.post(`${configs.command.hardReboot}`,{},response,UserApi.getAuthorizedHeader(),error);
    }

    static restartANPR=async (response,error)=>{
        await Api.post(`${configs.command.restartANPR}`,{},response,UserApi.getAuthorizedHeader(),error);
    }

    static eraseImages=async (response,error)=>{
        await Api.post(`${configs.command.eraseImages}`,{},response,UserApi.getAuthorizedHeader(),error);
    }


    static shutdown=async (response,error)=>{
        await Api.post(`${configs.command.shutdown}`,{},response,UserApi.getAuthorizedHeader(),error);
    }








}