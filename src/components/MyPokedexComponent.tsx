import {Card, Stack, TextField, Typography, useTheme} from "@mui/material";
import {createPokedexCall, Pokedex} from "../api/types/games/Pokedex";
import {useQuery} from "../UseQuery";
import {ReactElement, useState} from "react";

type MyPokedexComponentProps = {
    idOrName: number | string;
    selectedPokemon: string;
    selectPokemonCallBack: (index: string) => void;
}

export function MyPokedexComponent({
                                       idOrName,
                                       selectPokemonCallBack,
                                       selectedPokemon
                                   }: MyPokedexComponentProps): ReactElement {
    let pokedex: Pokedex = useQuery<Pokedex>(createPokedexCall(idOrName));
    let [searchQuery, setSearchQuery] = useState<string>("")

    return (
        <Card>
            <Stack
                height={"85vh"}
                style={{padding: "1vh"}}
            >
                <TextField
                    style={{padding: "1vh"}}
                    variant={"filled"}
                    label={"Search"}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Stack
                    padding={"1vh"}
                    spacing={"0.5vh"}
                    overflow={"auto"}
                >
                    {pokedex.pokemon_entries
                        .filter(pokemon => pokemon.pokemon_species.name.includes(searchQuery))
                        .map(pokemon => (
                            <SimplePokemonEntry
                                key={pokemon.entry_number} // Always include a key!
                                pokedex={pokedex}
                                selected={pokemon.pokemon_species.name === selectedPokemon}
                                index={pokemon.entry_number}
                                selectPokemonCallBack={selectPokemonCallBack}
                            />
                        ))}
                </Stack>

            </Stack>


        </Card>
    );
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
            borderRadius: "10px 1px 1px 1px",
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