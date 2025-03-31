export function createVersionGroupCall(idOrName: number | string): string {
    return "https://pokeapi.co/api/v2/version-group/" + idOrName + "/";
}

export type VersionGroup = {
    id: number
    name: string
    order: number
    generation: {
        name: string
        url: string
    }
    move_learn_methods: Array<{
        name: string
        url: string
    }>
    pokedexes: Array<{
        name: string
        url: string
    }>
    regions: Array<{
        name: string
        url: string
    }>
    versions: Array<{
        name: string
        url: string
    }>
}
