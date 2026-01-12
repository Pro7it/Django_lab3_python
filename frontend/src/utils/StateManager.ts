import type { MessageInstance } from "antd/es/message/interface";
import { create } from "zustand";
import { EmptyPlay, type Play } from "./ApiDtos";
import { checkAllFilled } from "./HookFolders";

type MessageStateT = {
    messageApi: null | MessageInstance;
    setMessageApi: (msgApi: MessageInstance) => void
}

type TokenStateT = {
    token: string;
    setToken: (newToken: string) => void
}

type InFirstT = {
    inFirst: string;
    setChecked: () => void
}

export const useMessage = create<MessageStateT>(set => ({
    messageApi: null,
    setMessageApi: (msgApi: MessageInstance) => set({ messageApi: msgApi })
}))

export const useToken = create<TokenStateT>(set => ({
    token: (() => {
        const accessToken = localStorage.getItem("access-token")
        return accessToken ? accessToken : ""
    })(),
    setToken: newToken => {
        localStorage.setItem("access-token", newToken)
        set({ token: newToken })
    }
}))


export const useInFirst = create<InFirstT>(set => ({
    inFirst: (() => localStorage.getItem("un-first") ?? "")(),
    setChecked: () => {
        localStorage.setItem("un-first", "checked")
        set({ inFirst: "no" })
    }
}))






type PlayStateT = {
    data?: Play,
    changeFiled: <K extends keyof Play>(field: K, v: Play[K]) => void
    init: (p: Play) => void

    savedData?: Play,
    undo: () => void,
    save: () => void,

    isValid: boolean,
    isChanged: boolean,

    valid: number,
    setValid: <K extends keyof Play>(filed: K, v: boolean) => void

    changed: number,
    setChanged: <K extends keyof Play>(filed: K, v: boolean) => void

    getFieldID: <K extends keyof Play>(filed: K) => number
}

const playKeys = Object.keys(EmptyPlay)
export const usePlayState = create<PlayStateT>((set, get) => ({
    data: undefined,
    savedData: undefined,
    isValid: false, //? я не знаю чому але я зробив щоб коли воно false то це типу жодних проблем усе ок....
    isChanged: false,
    valid: 0,
    changed: 0,
    changeFiled: (field, value) => {
        set((state) => {
            if (!state.data) return state;
            const newData = { ...state.data, [field]: value }
            const saved = get().savedData
            if (saved && saved[field] != value)
                get().setChanged(field, true)
            return { data: newData }
        })
    },
    init: (p) => {
        set({ data: p, savedData: p, valid: 0, changed: 0, isValid: !checkAllFilled(p, EmptyPlay, ["play_id", "image", "directors", "actors", "user_rating", "user_liked"]), isChanged: false })

    },
    undo: () => {
        const saved = get().savedData;
        set({ data: saved, changed: 0, isChanged: false, isValid: !checkAllFilled(saved ?? EmptyPlay, EmptyPlay, ["play_id", "image", "directors", "actors", "user_rating", "user_liked"]), valid: 0 });
    },
    save: () => set({ savedData: get().data, changed: 0, isChanged: false }),
    setValid: (field, v) => {
        set((state) => {
            const i = playKeys.indexOf(field);
            if (i === -1) return state;
            let mask = state.valid;
            if (mask === -1)
                mask = 0
            mask = v ? mask | (1 << i) : mask & ~(1 << i);
            const update: Partial<PlayStateT> = { valid: mask };

            if (state.isValid !== Boolean(mask)) {
                update.isValid = Boolean(mask);
            }

            return update;
        });
    },

    setChanged: (field, v) => {
        set((state) => {
            const i = playKeys.indexOf(field);

            if (i === -1) return state;
            let mask = state.changed;
            if (mask === -1)
                mask = 0
            mask = v ? mask | (1 << i) : mask & ~(1 << i);
            const update: Partial<PlayStateT> = { changed: mask };

            if (state.isChanged !== Boolean(mask)) {
                update.isChanged = Boolean(mask);
            }

            return update;
        });
    },

    getFieldID: field => playKeys.indexOf(field)
}))