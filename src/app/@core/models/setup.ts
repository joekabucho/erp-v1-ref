export class Location {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}
export class Scope {
  id: number;
  name: string;
  risk: string;
  activity: string;
  department: any;
  hazard: any;
}
export class Hazard {
  id: number;
  name: string;
  consequence: string;
  control: string;

}
export class Attendants {
  id: number;
  firstname: string;
  lastname: string;
  phone_number: string;
  id_number: string;
}
export class PPEnames {
  id: number;
  name: string;
}
export class SSEnames {
  id: number;
  name: string;
}
export class CertNames {
  id: number;
  name: string;
}
export class Departments {
  id: number;
  name: string;
  division: any;
  teams: any;
}
export class Sites {
  id: number;
  name: string;
  location: any;
}
