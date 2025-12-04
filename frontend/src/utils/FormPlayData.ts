import type { Genre, Play } from "./ApiDtos";

export const objA2numA = <T,>(arr: T[] | number[], idField: keyof T): number[] => {
    if (arr.length > 0 && typeof arr[0] !== "number")
        return arr.map((o) => (o as T)[idField as keyof T] as number);
    return arr as number[];
};

export const obj2num = <T,>(el: T | number, idField: keyof T): number => {
    if (typeof el !== "number")
        return (el as T)[idField as keyof T] as number;
    return el as number;
};


export const formPlayData = (data: Play): FormData => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("author", data.author);
    formData.append("description", data.description);
    formData.append("duration", data.duration.toString());
    formData.append("genre_id", obj2num<Genre>(data.genre ?? 0, "genre_id").toString())


    objA2numA(data.actors, "actor_id").forEach((id) =>
        formData.append("actor_ids", id.toString())
    );
    objA2numA(data.directors, "director_id").forEach((id) =>
        formData.append("director_ids", id.toString())
    );

    if (data.image instanceof File) {
        // if (data.image != null) {
        formData.append("image_file", data.image);
    } else if (typeof data.image === "string") {
        formData.append("image_url", data.image);
    } else {
        formData.append("image_url", "");
    }

    return formData
}