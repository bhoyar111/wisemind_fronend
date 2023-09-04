import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { authApi } from "../../../../../utils/api";

@Injectable({
  providedIn: "root",
})
export class GameService {
  object_value: any;
  json_value: any;

  constructor(private http: HttpClient) {}

  getDataDS() {
    return this.http.get(`${authApi.baseURL}/game-ds`);
  }

  getData() {
    return this.http.get(`${authApi.baseURL}/games`);
  }

  addData(data: any) {
    return this.http.post<any>(`${authApi.baseURL}/game-add`, data);
  }

  getOneData(id: number) {
    return this.http.get(`${authApi.baseURL}/game-get/${id}`);
  }

  updateOneData(id: number, updatedData: any) {
    return this.http.put<any>(`${authApi.baseURL}/game-update/${id}`, updatedData);
  }

  deleteOneData(id: number) {
    return this.http.delete(`${authApi.baseURL}/game-delete/${id}`);
  }
  json_convert(value: any) {
    this.object_value = JSON.stringify(value);
    this.json_value = JSON.parse(this.object_value);
    return this.json_value;
  }
}
