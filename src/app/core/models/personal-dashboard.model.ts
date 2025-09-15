import {CustomerSale} from './customer-sales.model';
import {ExporterSale} from './exporter-sales.model';

export interface PersonalDashboardModel {
  cleanMoneySalary: number;
  dirtyMoneySalary: number;
  cleanMoneySalaryPreviousWeek: number;
  dirtyMoneySalaryPreviousWeek: number;
  quota: boolean;
  exporterQuota: boolean;
  customerSaleDtoList: CustomerSale[];
  exporterSaleDtoList: ExporterSale[];
  topSellers: { name: string; quantity: number, reward: number }[];
}
