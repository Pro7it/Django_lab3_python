import { Varialbles } from "../config";

const errorHandle = (e: string | object) => {
    if (Varialbles.devMode) {
        console.log(e)
    }
    return null
}

const queryMeta: RequestInit = {
    headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${getAccessToken()}`,
    },
    credentials: Varialbles.cookies ? "include" : undefined
}

const handleAuth = (data: Response) => {
    if(data.status == 401){
        // location.assign("/login")
    }
    return Promise.resolve((null))
}

export const response2obj = <T>(data: Response) => data.ok ? data.text().then(d => JSON.parse(d) as T).catch(errorHandle) : handleAuth(data)

export const getQuery = <T extends object>(path: string, url: string = Varialbles.backend) => fetch(url + path, {
    ...queryMeta
})
    .then(response2obj<T>)
    .catch(errorHandle)

export const postQuery = <T extends object>(path: string, body: object, url: string = Varialbles.backend) => fetch(url + path, {
    ...queryMeta,
    method: "POST",
    body: JSON.stringify(body),
})
    .then(response2obj<T>)
    .catch(errorHandle)

export const putQuery = <T extends object>(path: string, body: T, url: string = Varialbles.backend) => fetch(url + path, {
    ...queryMeta,
    method: "PUT",
    body: JSON.stringify(body),
})
    .then(response2obj<T>)
    .catch(errorHandle)

export const patchQuery = <T extends object>(path: string, body: object, url: string = Varialbles.backend) => fetch(url + path, {
    ...queryMeta,
    method: "PATCH",
    body: JSON.stringify(body),
})
    .then(response2obj<T>)
    .catch(errorHandle)

export const deleteQuery = (path: string, url: string = Varialbles.backend): Promise<boolean> => fetch(url + path, {
    ...queryMeta,
    method: "DELETE"
})
    .then(r => r.ok)
    .catch(e => (errorHandle(e), false))