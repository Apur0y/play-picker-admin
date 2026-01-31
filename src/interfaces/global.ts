export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  role: string; // Or use a union type like "INDIVIDUAL" | "ORGANIZATION" | etc. if you know all possible values
}

export type ErrorTypes = {
  success: boolean;
  message: string;
};
