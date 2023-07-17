import configs from './config.json';
import {UserApi} from "./UserApi";

export class ImageApi {
    static getImg=(style,location)=>{
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'blob'; //so you can access the response like a normal URL
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                let img = document.createElement('img');
                img.setAttribute("style",style);
                img.src = URL.createObjectURL(xhr.response); //create <img> with src set to the blob
                document.body.appendChild(img);
            }
        };
        xhr.open('GET', `${configs.getImages}/${location}`, true);
        xhr.setRequestHeader('Authorization', UserApi.getAuthorizedHeader());
        xhr.send();
    }
}