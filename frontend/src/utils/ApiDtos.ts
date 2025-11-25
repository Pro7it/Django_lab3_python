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
  image: string | File |null;
  play_id: number;
  actors: number[] | Actor[];
  directors: number[] | Director[];
  name: string;
  duration: number;
  description: string;
  author: string;
  genre: number | Genre;
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
    genre: 0,
    play_id: 0
}