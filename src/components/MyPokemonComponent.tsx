import {
    Button,
    Card,
    Divider,
    IconButton,
    Stack,
    Table,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";
import {createPokemonCall, Pokemon} from "../api/types/pokemon/Pokemon";
import {
    createPokemonSpeciesCall, PokemonSpecies
} from "../api/types/pokemon/PokemonSpecies";
import {useQuery} from "../UseQuery";
import {EvolutionChain, EvolvesTo} from "../api/types/evolution/EvolutionChain";
import {SimpleTreeView} from '@mui/x-tree-view/SimpleTreeView';
import {TreeItem} from "@mui/x-tree-view";
import React, {JSX} from "react";
import {Info} from "@mui/icons-material";

type PokemonComponentProps = {
    idOrName: number | string
    selectPokemonCallBack: (index: string) => void;
}

export function MyPokemonComponent({
                                       idOrName, selectPokemonCallBack
                                   }: PokemonComponentProps) {

    const pokemon = useQuery<Pokemon>(createPokemonCall(idOrName));
    const pokemonSpecies = useQuery<PokemonSpecies>(createPokemonSpeciesCall(idOrName));

    const pokemonData = new Map<string, string>();
    pokemonData.set("Types", pokemon.types.map(type => type.type.name).join(", "));
    pokemonData.set("Height", (pokemon.height / 10).toString() + " m");
    pokemonData.set("Weight", (pokemon.weight / 10).toString() + " kg");
    let statsSum = pokemon.stats.map(stat => stat.base_stat).reduce((a, b) => a + b, 0).toString();

    const speciesData = new Map<string, string>();
    speciesData.set("Generation", pokemonSpecies.generation.name);
    speciesData.set("Color", pokemonSpecies.color.name);
    speciesData.set("Egg groups", pokemonSpecies.egg_groups.map(group => group.name).join(", "));
    speciesData.set("Capture rate", pokemonSpecies.capture_rate.toString());
    speciesData.set("Base happiness", pokemonSpecies.base_happiness.toString());
    speciesData.set("Gender rate", pokemonSpecies.gender_rate > 0 ? (pokemonSpecies.gender_rate * 12.5).toString() + "% female" : "unkown");
    speciesData.set("Growth rate", pokemonSpecies.growth_rate.name);
    speciesData.set("Genera", pokemonSpecies.genera.filter(gen => gen.language.name === "en").map(gen => gen.genus).join(", "));
    speciesData.set("Hatch counter", pokemonSpecies.hatch_counter.toString())

    return <Card
        variant={"outlined"}
    >
        <Stack
            overflow={"auto"}
            height={"85vh"}
            spacing={"0.5vh"}
            style={{padding: "1vh"}}
        >
            <Stack alignItems={"center"}>
                <Typography
                    variant={"h5"}>{pokemon.id + ". " + pokemonSpecies.name}
                </Typography>
            </Stack>
            <Divider/>
            <Stack alignItems={"center"}>
                <img
                    style={{borderStyle: "ridge"}}
                    width={"200px"}
                    height={"200px"}
                    src={pokemon.sprites.other["official-artwork"].front_default}
                    alt={pokemon.name + " front"}
                />
            </Stack>
            <Divider/>
            <div>
                <Typography variant={"h6"}>Pokemon data</Typography>
                <DataTable data={pokemonData}/>
            </div>
            <Divider/>
            <div>
                <Typography variant={"h6"}>Species data</Typography>
                <DataTable data={speciesData}/>
            </div>
            <Divider/>
            <div>
                <Typography variant={"h6"}>Evolution</Typography>
                <EvolutionEntry
                    species={pokemonSpecies}
                    selectPokemonCallBack={selectPokemonCallBack}
                />
            </div>
            <Divider/>
            <div>
                <Typography variant={"h6"}>Stats</Typography>
                <DataTable
                    data={new Map(pokemon.stats.map(stat => [stat.stat.name, stat.base_stat.toString()] as [string, string]).concat([["sum", statsSum]]))}
                />
            </div>
            <Divider/>
        </Stack>
    </Card>
}

type DataTableProps = {
    data: Map<string, string>
}

function DataTable({data}: DataTableProps) {
    return <Stack alignItems={"center"}>
        <Table style={{width: "95%"}}>
            {Array.from(data.entries()).map(([key, value]) => <TableRow>
                <TableCell
                    align={"left"}
                    padding={"none"}
                    style={{borderBottom: "none"}}
                >
                    {key}:
                </TableCell>
                <TableCell
                    align={"right"}
                    padding={"none"}
                    style={{borderBottom: "none"}}
                >
                    {value}
                </TableCell>
            </TableRow>)}
        </Table>
    </Stack>
}

type EvolutionEntryProps = {
    species: PokemonSpecies
    selectPokemonCallBack: (index: string) => void;
}

function EvolutionEntry({
                            species, selectPokemonCallBack
                        }: EvolutionEntryProps) {
    let evolutionChain = useQuery<EvolutionChain>(species.evolution_chain.url);

    let expandedItems: string[] = [];

    function collectNames(evolvesTo: EvolvesTo) {
        expandedItems.push(evolvesTo.species.name);
        evolvesTo.evolves_to.forEach(innerEvolvesTo => {
            collectNames(innerEvolvesTo)
        })
    }

    collectNames(evolutionChain.chain)

    function recursiveTree(evolvesTo: EvolvesTo): JSX.Element {
        return <TreeItem
            itemId={evolvesTo.species.name}
            label={<EvolutionChainEntry species={evolvesTo.species.name}
                                        selectPokemonCallBack={selectPokemonCallBack}/>}
        >
            {evolvesTo.evolves_to.map(innerEvolvesTo => recursiveTree(innerEvolvesTo))}
        </TreeItem>;
    }

    return <SimpleTreeView
        disableSelection
        expandedItems={expandedItems}
    >
        {recursiveTree(evolutionChain.chain)}
    </SimpleTreeView>
}

type EvolutionChainEntryProps = {
    species: string
    selectPokemonCallBack: (index: string) => void;
}

function EvolutionChainEntry({
                                 species, selectPokemonCallBack
                             }: EvolutionChainEntryProps) {
    let pokemon = useQuery<Pokemon>(createPokemonCall(species));
    return <Card variant={"outlined"}>
        <Stack direction={"row"} justifyContent={"space-between"}>
            <Stack direction={"row"} alignItems={"center"}>
                <img
                    width={"50px"}
                    src={pokemon.sprites.front_default}
                    alt={species}
                />
                <Button
                    onClick={() => {
                        selectPokemonCallBack(species);
                        window.scrollTo(0, 0);
                    }}
                >
                    <Typography>
                        {species}
                    </Typography>
                </Button>
            </Stack>
            <IconButton>
                <Info></Info>
            </IconButton>
        </Stack>
    </Card>
}