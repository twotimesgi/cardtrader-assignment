import {atom, useAtom} from 'jotai';
const showFilters = atom(true);
export const useShowFilters = () => {
    return useAtom(showFilters);
}