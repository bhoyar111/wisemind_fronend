import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { authApi } from "../../../../../utils/api";

@Injectable({
    providedIn: 'root'
})
export class DesignationService {

    object_value: any;
    json_value: any;

    constructor(private http : HttpClient) {}

    getData() {
        return this.http.get(`${authApi.baseURL}/designations`);
    }

    addData(data:any) {
        return this.http.post<any>(`${authApi.baseURL}/designation-add`, data);
    }

    getOneData(id: number) {
        return this.http.get(`${authApi.baseURL}/designation-get/${id}`);
    }

    updateOneData(id: number, updatedData: any) {
        return this.http.put<any>(
          `${authApi.baseURL}/designation-update/${id}`,
          updatedData
        );
    }

    deleteOneData(id: number) {
        return this.http.delete(`${authApi.baseURL}/designation-delete/${id}`);
    }
    json_convert(value: any) {
        this.object_value = JSON.stringify(value);
        this.json_value = JSON.parse(this.object_value);
        return this.json_value;
    }
}
