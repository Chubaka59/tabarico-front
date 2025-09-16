import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RewardModel} from '../../core/models/reward.model';

@Injectable({ providedIn: 'root' })
export class RewardService {
  private apiUrl = '/api/rewards'; // backend Spring Boot

  constructor(private http: HttpClient) {}

  getAll(): Observable<RewardModel[]> {
    return this.http.get<RewardModel[]>(this.apiUrl);
  }

  create(reward: RewardModel): Observable<RewardModel> {
    return this.http.post<RewardModel>(this.apiUrl, reward);
  }

  update(reward: RewardModel): Observable<RewardModel> {
    return this.http.put<RewardModel>(`${this.apiUrl}/${reward.position}`, reward);
  }
}
