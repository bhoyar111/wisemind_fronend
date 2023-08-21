import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { authApi } from "../../../../../utils/api";

@Injectable({
  providedIn: "root",
})
export class SubjectService {

  object_value: any;
  json_value: any;

  constructor(private http: HttpClient) {}

  getDataDS() {
    return this.http.get(`${authApi.baseURL}/subject-ds`);
  }

  getData() {
    return this.http.get(`${authApi.baseURL}/subjects`);
  }

  addData(data: any) {
    return this.http.post<any>(`${authApi.baseURL}/subject-add`, data);
  }

  getOneData(id: number) {
    return this.http.get(`${authApi.baseURL}/subject-get/${id}`);
  }

  updateOneData(id: number, updatedData: any) {
    return this.http.put<any>(
      `${authApi.baseURL}/subject-update/${id}`,
      updatedData
    );
  }

  deleteOneData(id: number) {
    return this.http.delete(`${authApi.baseURL}/subject-delete/${id}`);
  }
  json_convert(value: any) {
    this.object_value = JSON.stringify(value);
    this.json_value = JSON.parse(this.object_value);
    return this.json_value;
  }
}
