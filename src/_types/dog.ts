export interface DogRequest {
  imageKey: string;
  name: string;
  sex: string;
  birthDate: Date;
  adoptionDate: Date;
  breedId: string;
}

export interface DogResponse {
  id: string;
  imageKey: string;
  name: string;
  sex: string;
  birthDate: Date;
  adoptionDate: Date;
  breedId: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DogProfile {
  name: string;
  sex: string;
  birthDate: string;
  adoptionDate: string;
  imageKey: string;
  breed: { name: string }
}