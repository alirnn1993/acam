import configs from './config.json';
import {Api} from "./Api";

export class UserApi {
    static login = async (data, response, error) => {
        await Api.post(`${configs.user.login}`, data, response, configs.requestHeader, error);
    }

    static register = (data, response) => {
        Api.getInstance().post(`${configs.server.Api}/${configs.user.register}`, data, response);
    }

   static updateProfile=async (date,response,error)=>{
        await Api.put(`${configs.user.update}`,date,response,this.getAuthorizedHeader(),error);
   }
    static refresh = async (response, error) => {
        await Api.post(configs.user.refresh, {}, response, this.getAuthorizedHeader(), error);
    }

    static getAuthorizedHeader = () => {
        return {
            ...configs.requestHeader,
            Authorization: `bearer ${localStorage.getItem('token')}`
        };
    }

    static getToken=()=>{
        return `bearer ${localStorage.getItem('token')}`;
    }


    static logout = async (response, error) => {
        await Api.post(`${configs.user.logout}`, {}, response, this.getAuthorizedHeader(), error);

    }

    static getAllUser = async (response, error) => {
        await Api.get(`${configs.user.user}`, '', response, this.getAuthorizedHeader(), error);
    }

    static activateUser = async (data, response, error) => {
        await Api.post(`${configs.user.activate}/${data}`, {}, response, this.getAuthorizedHeader(), error);
    }

    static deactivateUser = async (data, response, error) => {
        await Api.post(`${configs.user.deactivate}/${data}`, {}, response, this.getAuthorizedHeader(), error);
    }
    static getUserById = async (data, response, error) => {
        await Api.get(`${configs.user.user}`, data, response, this.getAuthorizedHeader(), error);
    }

    static updateUser = async (data,id, response, error) => {
        await Api.put(`${configs.user.user}/${id}`, data, response, UserApi.getAuthorizedHeader(), error);
    }
    static updateMyself = async (data, response, error) => {
        await Api.put(`${configs.user.update}`, data, response, UserApi.getAuthorizedHeader(), error);
    }


    static removeUser=async (id,response,error)=>{
        await Api.delete(`${configs.user.user}`,id,response,UserApi.getAuthorizedHeader(),error);
    }




    static insertNewUser = async (data, response, error) => {
        await Api.post(`${configs.user.user}`, data, response, this.getAuthorizedHeader(), error);
    }


}
