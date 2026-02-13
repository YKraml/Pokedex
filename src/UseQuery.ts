import {use} from "react";

const promiseCache = new Map<string, Promise<unknown>>();

/**
 * Executes the given query and returns an object of the given type.
 */
export function useQuery<type>(query: string): type {
    if (!promiseCache.has(query)) {
        let response = fetch(query);
        promiseCache.set(query, response.then(onFullfilled => onFullfilled.json()))
    }

    return use(promiseCache.get(query)! as Promise<type>);
}