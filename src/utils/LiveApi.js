import configs from './config.json';
import {UserApi} from "./UserApi";
import {Api} from './Api';


export class LiveApi {
    static enableCamera=async (data,response,error)=>{
        await Api.post(`${configs.live}/${data}`, null, response, UserApi.getAuthorizedHeader(), error);
    }
}