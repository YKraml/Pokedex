export function createGenerationCall(idOrName: number | string): string {
    return "https://pokeapi.co/api/v2/generation/" + idOrName + "/";
}


export type Generation = {
    id: number
    name: string
    abilities: Array<any>
    main_region: {
        name: string
        url: string
    }
    moves: Array<{
        name: string
        url: string
    }>
    names: Array<{
        name: string
        language: {
            name: string
            url: string
        }
    }>
    pokemon_species: Array<{
        name: string
        url: string
    }>
    types: Array<{
        name: string
        url: string
    }>
    version_groups: Array<{
        name: string
        url: string
    }>
}
