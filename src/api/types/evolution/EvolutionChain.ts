export interface EvolutionChain {
    baby_trigger_item: any
    chain: EvolvesTo
    id: number
}

export interface EvolvesTo {
    evolution_details: EvolutionDetail[]
    evolves_to: EvolvesTo[]
    is_baby: boolean
    species: Species
}

export interface EvolutionDetail {
    gender: any
    held_item: any
    item?: Item
    known_move: any
    known_move_type?: KnownMoveType
    location?: Location
    min_affection?: number
    min_beauty: any
    min_happiness?: number
    min_level: any
    needs_overworld_rain: boolean
    party_species: any
    party_type: any
    relative_physical_stats: any
    time_of_day: string
    trade_species: any
    trigger: Trigger
    turn_upside_down: boolean
}

export interface Item {
    name: string
    url: string
}

export interface KnownMoveType {
    name: string
    url: string
}

export interface Location {
    name: string
    url: string
}

export interface Trigger {
    name: string
    url: string
}

export interface Species {
    name: string
    url: string
}
