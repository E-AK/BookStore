export default interface User {
  id: string;
  role: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  postalCode: string | null;
  address: string | null;
  email: string;
  phoneNumber: string | null;
}
