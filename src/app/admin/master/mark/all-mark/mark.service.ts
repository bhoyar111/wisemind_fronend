import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { authApi } from "../../../../../utils/api";

@Injectable({
  providedIn: 'root'
})
export class MarkService {

    object_value: any;
    json_value: any;

    constructor(private http : HttpClient) {}

    getDataDS() {
        return this.http.get(`${authApi.baseURL}/mark-ds`);
    }

    getFilterData(searchParams: any): Observable<any> {
      return this.http.get<any>(`${authApi.baseURL}/marks`, { params: searchParams});
    }

    getData() {
        return this.http.get(`${authApi.baseURL}/marks`);
    }

    addData(data:any) {
        return this.http.post<any>(`${authApi.baseURL}/mark-add`, data);
    }

    getOneData(id: number) {
        return this.http.get(`${authApi.baseURL}/mark-update/${id}`);
    }

    updateOneData(id: number, updatedData: any) {
    return this.http.put<any>(`${authApi.baseURL}/mark-update/${id}`, updatedData);
    }

    deleteOneData(id: number) {
        return this.http.delete(`${authApi.baseURL}/mark-delete/${id}`);
    }

    json_convert(value: any) {
        this.object_value = JSON.stringify(value);
        this.json_value = JSON.parse(this.object_value);
        return this.json_value;
    }
}
