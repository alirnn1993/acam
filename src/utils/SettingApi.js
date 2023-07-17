import configs from './config.json';
import {UserApi} from "./UserApi";
import {Api} from './Api';


export class SettingApi {
    static updateSystem = async (data, response, error) => {
        await Api.post(`${configs.setting.system}`, data, response, UserApi.getAuthorizedHeader(), error);
    }

    static updateTime = async (data, response, error) => {
        await Api.post(`${configs.setting.time}`, data, response, UserApi.getAuthorizedHeader(), error);
    }

    static updateTCPIPConfiguration = async (data, response, error) => {
        await Api.post(`${configs.setting.tcpIpConfiguration}`, data, response, UserApi.getAuthorizedHeader(), error);
    }

    static updateFTPServer = async (data, response, error) => {
        await Api.post(`${configs.setting.ftpServer}`, data, response, UserApi.getAuthorizedHeader(), error);
    }

    static updateLEDSetting = async (data, response, error) => {
        await Api.post(`${configs.setting.led}`, data, response, UserApi.getAuthorizedHeader(), error);
    }

    static updateTemperatureSetting = async (data, response, error) => {
        await Api.post(`${configs.setting.temperature}`, data, response, UserApi.getAuthorizedHeader(), error);
    }

    static getSetting = async (response, error) => {
        await Api.get(`${configs.setting.get}`, null, response, UserApi.getAuthorizedHeader(), error);
    }
}