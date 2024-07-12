import { Atom, atom } from "jotai";
import { Station } from "./types/Station";

export const fromStationAtom = atom<Station | null>(null)
export const toStationAtom = atom<Station | null>(null)

export const pickerVisibleAtom = atom(false)
export const searchingStationAtom = atom<Atom<Station | null>>(fromStationAtom)