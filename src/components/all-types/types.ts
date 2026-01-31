export type User = {
  id: string;
  name: string;
  role: 'USER' | 'ADMIN'; // You can extend this if there are other roles
  status: 'ACTIVE' | 'INACTIVE'; // You can extend this if there are other statuses
  avatar: string | null;
  dateOfBirth: string;
  phone: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER'; // You can extend this if there are other genders
  address: string | null;
  createdAt: string;
  updatedAt: string;
  Auth:Auth
};

export type Report = {
  id: string;
  title: string;
  type: 'report' | 'otherType'; // You can extend this if there are other types
  date: string;
  reportUrls: string[];
  result: string | null;
  recomendation: string | null;
  resultUrls: string[];
  status: 'PENDING' | 'COMPLETED' | 'FAILED'; // You can extend this if there are other statuses
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: User;
};

interface Auth{
    email:string
}

export type ResponseData = {
  data: Report[];
};
