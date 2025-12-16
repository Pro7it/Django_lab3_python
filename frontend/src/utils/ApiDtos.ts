export interface Genre {
  genre_id: number,
  name: string,
  description: string
}

export interface Actor {
  actor_id: number,
  name: string,
  birthdate: string
}

export interface Director {
  director_id: number,
  name: string,
  birthdate: string,
  biography: string,
  awards: string
}

export interface Play {
  image: string | File | null;
  play_id: number;
  actors: number[] | Actor[];
  directors: number[] | Director[];
  name: string;
  duration: number;
  description: string;
  author: string;
  genre: number | Genre | null;
  user_liked: boolean,
  user_rating: number,
}

export interface UserLogin {
  email: string,
  password: string
}

export const EmptyPlay: Play = {
  image: null,
  name: "",
  actors: [],
  directors: [],
  author: "",
  description: "",
  duration: 0,
  genre: null,
  play_id: 0,
  user_liked: false,
  user_rating: 0,
}

export const checkInvalid = <T extends keyof Play>(field: T, v: Play[T]) => v == EmptyPlay[field]