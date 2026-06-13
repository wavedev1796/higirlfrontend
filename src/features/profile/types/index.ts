export interface CatalogItem {
  id: number;
  nombre: string;
  icono?: string | null;
}

export type CivilStatus =
  | "soltera"
  | "casada"
  | "union_libre"
  | "divorciada"
  | "viuda";

export interface Profile {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  usuario: string;
  ciudad?: string | null;
  fechaNacimiento?: string | null;
  profesion?: string | null;
  empresa?: string | null;
  estadoCivil?: CivilStatus | null;
  tieneHijos: boolean;
  numeroHijos: number;
  bio?: string | null;
  foto?: string | null;
  intereses: CatalogItem[];
  categorias: CatalogItem[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  ciudad?: string;
  fechaNacimiento?: string;
  profesion?: string;
  empresa?: string;
  estadoCivil?: CivilStatus;
  tieneHijos?: boolean;
  numeroHijos?: number;
  bio?: string;
}
