import configs from './config.json';
import {Api} from "./Api";

export class FacilityApi {
    static getFacilityByRef=async (data,response,error)=>{
        await Api.get(`${configs.facility.base}`,data,response,{},error);
    }
}