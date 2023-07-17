import configs from './config.json';
import {UserApi} from "./UserApi";
import {Api} from './Api';

export class PlateApi {

    static getAllPlate = async (type,page,response, error) => {
        await Api.get(`${configs.plate.base}/${type}/${page}`, null, response, UserApi.getAuthorizedHeader(), error);
    }

    static deletePlate = async (id, response, error) => {
        await Api.delete(`${configs.plate.base}/${id}`, '', response, UserApi.deactivateUser(), error);
    }

    static addPlate = async (data, response, error) => {
        await Api.post(`${configs.plate.base}`, data, response, UserApi.getAuthorizedHeader(), error);
    }
}