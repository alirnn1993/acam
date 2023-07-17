import configs from './config.json';
import Axios, {CancelToken} from 'axios';

export class Api {
    static #instance = null;
    #history = null;
    static stateChanger;

    constructor(history) {
        this.#history = history;
    }

    static getInstance = (history) => {
        if (this.#instance === null)
            this.#instance = new Api(history);
        return (this.#instance);
    }


    static post = async (url, data, response, header = configs.requestHeader, errorHandler) => {
        const {
            host, hostname, href, origin, pathname, port, protocol
        } = window.location;
        const source = CancelToken.source();
        const timeout = setTimeout(() => {
            source.cancel();
            // Timeout Logic
        }, 60000);
        await Axios.post(`${configs.isDemo ? '' : `${protocol}//`}${configs.isDemo ? configs.server.Api : hostname}${configs.hasPort ? `:${configs.port}` : ''}/${url}`, data, {
            headers: header,
            cancelToken: source.token
        }).then(result => {
            clearTimeout(timeout);
            response(result);
        }).catch(e => errorHandler(e));
    };


    static get = async (url, data, response, header = configs.requestHeader, errorHandler) => {
        const {
            host, hostname, href, origin, pathname, port, protocol
        } = window.location;
        await Axios.get(`${configs.isDemo ? '' : `${protocol}//`}${configs.isDemo ? configs.server.Api : hostname}${configs.hasPort ? `:${configs.port}` : ''}/${url}${data ? `/${data}` : ''}`, {headers: header})
            .then(result => {
                response(result)
            })
            .catch(e => this.defaultErrorHandler(e, errorHandler));

    };

    static put = (url, data, res, header = configs.requestHeader, errorHandler) => {
        const {
            host, hostname, href, origin, pathname, port, protocol
        } = window.location;
        data.append('_method', 'PUT');
        Axios.post(`${configs.isDemo ? '' : `${protocol}//`}${configs.isDemo ? configs.server.Api : hostname}${configs.hasPort ? `:${configs.port}` : ''}/${url}`, data, {headers: header}).then(result => {
            res(result)
        }).catch(e => this.defaultErrorHandler(e, errorHandler));
    };

    static delete = (url, data, res, header = configs.requestHeader, handler) => {
        const {
            host, hostname, href, origin, pathname, port, protocol
        } = window.location;
        Axios.delete(`${configs.isDemo ? '' : `${protocol}//`}${configs.isDemo ? configs.server.Api : hostname}${configs.hasPort ? `:${configs.port}` : ''}/${url}${data ? `/${data}` : ''}`, {headers: header})
            .then(result => {
                res(result)
            }).catch(e => handler(e));
    }
    static  defaultErrorHandler = (error, errorHandler) => {
        errorHandler(error);
        // if (error.response) {
        //     switch (error.response.status % 100) {
        //         case 4:
        //
        //             break;
        //         case 500:
        //
        //             break;
        //
        //         default:
        //
        //     }
        // } else if (error.request) {
        //     this.connectionError();
        // } else {
        //
        // }
    }

    static  error404 = () => {
        this.goTo("/404");
    }

    static error500 = () => {
        this.goTo("/500");
    }

    static connectionError = () => {

    }

    static goTo = (address) => {
        // this.#history.push(address);
    }
}
