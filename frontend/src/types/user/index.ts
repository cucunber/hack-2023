export interface IUser {
  id: number;
  inn: number | string;
  username: string;
  email: string;
  is_staff: boolean;
  first_name: string;
  last_name: string;
  user_agreement: boolean;
  offer_agreement: boolean;
  show_phone_number: boolean;
  phone_number: string;
  interest: number[];
  job_title: string;
  organization: string;
}

export interface IToken {
  access: string,
  refresh: string,
}