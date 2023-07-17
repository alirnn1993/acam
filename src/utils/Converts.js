import configs from './config.json';

export class Converts {
    static sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    static convertImgSrc = (src) => {
        return `${configs.server.Storage}/${src}`
    }
    static toTimestamp = strDate => Date.parse(strDate);

    static convertPersianDateToUniversal = (date) => {
        return new Date(this.toTimestamp(date)).toLocaleDateString("en-US")
    }
    static formatNumber = (num, div = ",") => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, div);
    }

    static covertUniversalDateToPersianData = (date) => {
        return new Date(date).toLocaleDateString('fa-IR')
    }

    static convert2EnglishNo = str => {
        str = str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
        str = str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
        return str;
    }


}

export class Utils {
    static sleep = (ms) => new Promise((r) => setTimeout(r, ms));
}