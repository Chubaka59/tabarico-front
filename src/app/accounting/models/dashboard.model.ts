export interface DashboardModel {
  roleName: string;
  username: string;
  cleanMoneyCustomerSales: number;
  dirtyMoneyCustomerSales: number;
  enterpriseAmountExporterSales: number;
  quantityExporterSales: number;
  quota: boolean;
  exporterQuota: boolean;
  cleanMoneySalary: number;
  dirtyMoneySalary: number;
  cleanMoneySalaryPreviousWeek: number;
  dirtyMoneySalaryPreviousWeek: number;
  holiday: boolean;
  endOfHoliday?: Date;
  warning1: boolean;
  warning2: boolean;
}
