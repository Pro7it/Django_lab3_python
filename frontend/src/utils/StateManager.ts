import type { MessageInstance } from "antd/es/message/interface";
import { create } from "zustand";
import type { Play } from "./ApiDtos";

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
        localStorage.setItem("access-token", "checked")
        set({ inFirst: "no" })
    }
}))






type PlayStateT = {
    data?: Play,
    changeFiled: <K extends keyof Play>(field: K, v: Play[K]) => void
    init: (p: Play) => void

    savedData?: Play,
    undo: () => void,

    isValid: boolean,
    isChanged: boolean,

    valid: number,
    setValid: <K extends keyof Play>(filed: K, v: boolean) => void

    changed: number,
    setChanged: <K extends keyof Play>(filed: K, v: boolean) => void
}

const playKeys = Object.keys({} as Play)
export const usePlayState = create<PlayStateT>((set, get) => ({
    data: undefined,
    savedData: undefined,
    isValid: true,
    isChanged: false,
    valid: -1,
    changed: 0,
    changeFiled: (field, value) => {
        set((state) => {
            if (!state.data) return state;
            const newData = { ...state.data, [field]: value }
            return { data: newData }
        })
    },
    init: (p) => set({ data: p, savedData: p, valid: 0, changed: -1 }),
    undo: () => {
        const saved = get().savedData;
        set({ data: saved, changed: -1, valid: 0 });
    },
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
}))








