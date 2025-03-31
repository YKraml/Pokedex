export function createPokedexCall(idOrName: number | string): string {
    return "https://pokeapi.co/api/v2/pokedex/" + idOrName + "/";
}

export type Pokedex = {
    id: number
    name: string
    is_main_series: boolean
    descriptions: Array<{
        description: string
        language: {
            name: string
            url: string
        }
    }>
    names: Array<{
        name: string
        language: {
            name: string
            url: string
        }
    }>
    pokemon_entries: Array<{
        entry_number: number
        pokemon_species: {
            name: string
            url: string
        }
    }>
    region: {
        name: string
        url: string
    }
    version_groups: Array<{
        name: string
        url: string
    }>
}
