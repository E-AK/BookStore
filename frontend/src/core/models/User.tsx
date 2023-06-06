export default interface User {
  Id: string;
  Role: string;
  FullName: string;
  DateOfBirth: string;
  Gender: string;
  PostalCode: string | null;
  Address: string | null;
  Email: string;
  PhoneNumber: string | null;
}
