import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { authApi } from "../../../../utils/api"

@Injectable({
  providedIn: 'root'
})
export class MarkAllotService {

  object_value: any;
  json_value: any;

  constructor(private http: HttpClient) {}

  getDataDS() {
    return this.http.get(`${authApi.baseURL}/mark-allotment-ds`);
  }

  getData() {
    return this.http.get(`${authApi.baseURL}/student-class-wise`);
  }

  addData(data: any) {
    return this.http.post<any>(`${authApi.baseURL}/school-add`, data);
  }

  json_convert(value: any) {
    this.object_value = JSON.stringify(value);
    this.json_value = JSON.parse(this.object_value);
    return this.json_value;
  }
}
