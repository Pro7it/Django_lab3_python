import { Varialbles } from "../config";
import { useToken } from "./StateManager";


const errorHandle = (e: string | object) => {
    if (Varialbles.devMode) {
        console.log(e)
    }
    return null
}

const queryMeta = (formData?: boolean): RequestInit => ({
    headers: {
        ...(!formData ? { "Content-Type": "application/json" } : {}),
        ...(useToken.getState().token != "" ? { "Authorization": `Bearer ${useToken.getState().token}` } : {}),
    },
    credentials: Varialbles.cookies ? "include" : undefined
})

const handleAuth = (data: Response) => {
    const errorAuth = (r: { error?: string[] }) => {
        if (r.error && r.error[0] == "WrongData") {
            return null
        } else {
            location.assign("/login")
        }
    }

    if (data.status == 401) {
        location.assign("/login")
        // data.text().then(r => JSON.parse(r)).then(r => errorAuth(r))
    }
    return Promise.resolve((null))
}

export const response2obj = <T>(data: Response) => data.ok ? data.text().then(d => JSON.parse(d) as T).catch(errorHandle) : handleAuth(data)

export const getQuery = <T extends object>(path: string, url: string = Varialbles.backend) => fetch(url + path, {
    ...queryMeta()
})
    .then(response2obj<T>)
    .catch(errorHandle)

export const postQuery = <T extends object>(path: string, body: FormData, url: string = Varialbles.backend) => fetch(url + path, {
    ...queryMeta(true),
    method: "POST",
    body: body,
})
    .then(response2obj<T>)
    .catch(errorHandle)

export const deleteQuery = (path: string, url: string = Varialbles.backend): Promise<boolean> => fetch(url + path, {
    ...queryMeta(),
    method: "DELETE"
})
    .then(r => r.ok)
    .catch(e => (errorHandle(e), false))

export const putQuery = (path: string, formData: FormData, url: string = Varialbles.backend) =>
    fetch(url + path, {
        ...queryMeta(true),
        method: "PUT",
        body: formData,
    })
        .then(response2obj)
        .catch(errorHandle); 
