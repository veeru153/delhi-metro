import { Atom, atom } from "jotai";
import { Station } from "./types/Station";
import { SHORTEST_ROUTE } from "./constants";

export const fromStationAtom = atom<Station | null>(null)
export const toStationAtom = atom<Station | null>(null)
export const filterAtom = atom(SHORTEST_ROUTE);

export const pickerVisibleAtom = atom(false)
export const searchingStationAtom = atom<Atom<Station | null>>(fromStationAtom)