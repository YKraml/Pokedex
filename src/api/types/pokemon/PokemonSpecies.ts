export function createPokemonSpeciesCall(idOrName: number | string): string {
    return "https://pokeapi.co/api/v2/pokemon-species/" + idOrName + "/";
}

export type PokemonSpecies = {
    id: number
    name: string
    order: number
    gender_rate: number
    capture_rate: number
    base_happiness: number
    is_baby: boolean
    is_legendary: boolean
    is_mythical: boolean
    hatch_counter: number
    has_gender_differences: boolean
    forms_switchable: boolean
    growth_rate: {
        name: string
        url: string
    }
    pokedex_numbers: Array<{
        entry_number: number
        pokedex: {
            name: string
            url: string
        }
    }>
    egg_groups: Array<{
        name: string
        url: string
    }>
    color: {
        name: string
        url: string
    }
    shape: {
        name: string
        url: string
    }
    evolves_from_species: {
        name: string
        url: string
    }
    evolution_chain: {
        url: string
    }
    habitat: any
    generation: {
        name: string
        url: string
    }
    names: Array<{
        name: string
        language: {
            name: string
            url: string
        }
    }>
    flavor_text_entries: Array<{
        flavor_text: string
        language: {
            name: string
            url: string
        }
        version: {
            name: string
            url: string
        }
    }>
    form_descriptions: Array<{
        description: string
        language: {
            name: string
            url: string
        }
    }>
    genera: Array<{
        genus: string
        language: {
            name: string
            url: string
        }
    }>
    varieties: Array<{
        is_default: boolean
        pokemon: {
            name: string
            url: string
        }
    }>
}