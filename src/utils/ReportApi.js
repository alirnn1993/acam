import configs from './config.json';
import {UserApi} from "./UserApi";
import {Api} from './Api';

export class ReportApi {
    static getReport = async (data, response, error) => {
        await Api.post(`${configs.report.base}`, data, response, UserApi.getAuthorizedHeader(), error);
    }

    static getRoutineReport = async (response, error) => {
        await Api.get(`${configs.report.routine}`, null, response, UserApi.getAuthorizedHeader(), error);
    }


    static exportReport = async (data, response, error) => {
        await Api.post(`${configs.report.export}`, data, response, UserApi.getAuthorizedHeader(), error);
    }


}