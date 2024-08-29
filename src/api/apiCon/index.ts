import request from '@/utils/request';
import { AxiosPromise } from 'axios';


export function GetBomList(data:any){
    return request({
        // url: import.meta.env.VITE_APP_BASE_API+'/api/ProductBOM/getBOM',
        url: import.meta.env.VITE_APP_DY_100_API+'/api/ProductBOM/getBOM',
        method: 'post',
        data: data
    });
}