import {Card, Stack, Typography, useTheme} from "@mui/material";
import {createPokedexCall, Pokedex} from "../api/types/games/Pokedex";
import {useQuery} from "../UseQuery";
import {useState} from "react";

type MyPokedexComponentProps = {
    idOrName: number | string;
    selectedPokemon: string;
    selectPokemonCallBack: (index: string) => void;
}

export function MyPokedexComponent({
                                       idOrName,
                                       selectPokemonCallBack,
                                       selectedPokemon
                                   }: MyPokedexComponentProps) {
    let pokedex = useQuery<Pokedex>(createPokedexCall(idOrName));

    return <Card
        variant={"outlined"}
    >
        <Stack
            padding={"1vh"}
            spacing={"0.5vh"}
            overflow={"auto"}
            height={"85vh"}
        >
            {pokedex.pokemon_entries.map(pokemon => <SimplePokemonEntry
                pokedex={pokedex}
                selected={pokemon.pokemon_species.name === selectedPokemon}
                index={pokemon.entry_number}
                selectPokemonCallBack={selectPokemonCallBack}/>)}
        </Stack>
    </Card>
}

type PokemonEntry = {
    pokedex: Pokedex, index: number
    selected: boolean
    selectPokemonCallBack: (index: string) => void;
}

function SimplePokemonEntry({
                                pokedex, index, selected, selectPokemonCallBack
                            }: PokemonEntry) {
    let [isHovered, setHovered] = useState(false);
    let palette = useTheme().palette;
    const pokemonEntry = pokedex.pokemon_entries[index - 1];

    return <Card
        style={{
            padding: "1vh",
            minHeight: "1.3em",
            backgroundColor: selected ? palette.secondary.main : isHovered ? palette.secondary.light : palette.background.default,
        }}
        variant={"outlined"}
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => selectPokemonCallBack(pokemonEntry.pokemon_species.name)}
    >
        <Stack direction={"row"} alignItems={"center"}>
            <Typography>
                {pokemonEntry.entry_number + ". " + pokemonEntry.pokemon_species.name}
            </Typography>
        </Stack>
    </Card>
}