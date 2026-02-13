import {
    Box,
    Button,
    Card,
    Divider,
    IconButton,
    Modal,
    Stack,
    Table,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";
import {createPokemonCall, Pokemon} from "../api/types/pokemon/Pokemon";
import {createPokemonSpeciesCall, PokemonSpecies} from "../api/types/pokemon/PokemonSpecies";
import {useQuery} from "../UseQuery";
import {EvolutionChain, EvolutionDetail, EvolvesTo} from "../api/types/evolution/EvolutionChain";
import {SimpleTreeView} from '@mui/x-tree-view/SimpleTreeView';
import {TreeItem} from "@mui/x-tree-view";
import React, {JSX, ReactElement, useMemo, useState} from "react";
import {Info} from "@mui/icons-material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

type PokemonComponentProps = {
    idOrName: number | string
    selectPokemonCallBack: (index: string) => void;
}

function MyPokemonComponent({
                                idOrName, selectPokemonCallBack
                            }: PokemonComponentProps): ReactElement {

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

    // Sprite handling
    let spritesWithDescriptions = useMemo(() => {
        return getAllSpritesWithDescriptions(pokemon.sprites)
    }, [pokemon])

    let [spriteIndex, setSpriteIndex] = useState(0)

    useMemo(() => {
        const officialUrl = pokemon.sprites.other["official-artwork"].front_default;
        const index = spritesWithDescriptions.findIndex(s => s.url === officialUrl);
        setSpriteIndex(index)
    }, [pokemon, spritesWithDescriptions]);


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
            <Stack alignItems={"center"} direction={"column"}>
                <Stack alignItems={"center"} direction={"row"}>
                    <IconButton onClick={() => setSpriteIndex(spriteIndex - 1)} color={"primary"}>
                        <ArrowBackIosIcon/>
                    </IconButton>
                    <img
                        style={{borderStyle: "hidden", objectFit: "contain"}}
                        width={"200px"}
                        height={"200px"}
                        src={spritesWithDescriptions[(spriteIndex % spritesWithDescriptions.length + spritesWithDescriptions.length) % spritesWithDescriptions.length].url}
                    />
                    <IconButton onClick={() => setSpriteIndex(spriteIndex + 1)} color={"primary"}>
                        <ArrowForwardIosIcon/>
                    </IconButton>
                </Stack>

                <Typography variant={"subtitle2"}>
                    {spritesWithDescriptions[(spriteIndex % spritesWithDescriptions.length + spritesWithDescriptions.length) % spritesWithDescriptions.length].description}
                </Typography>
            </Stack>

            <Divider/>
            <Box className={"bg-"}>
                <Typography variant={"h6"}>Pokemon data</Typography>
                <DataTable data={pokemonData}/>
            </Box>
            <Divider/>
            <Box>
                <Typography variant={"h6"}>Species data</Typography>
                <DataTable data={speciesData}/>
            </Box>
            <Divider/>
            <Box>
                <Typography variant={"h6"}>Stats</Typography>
                <DataTable
                    data={new Map(pokemon.stats.map(stat => [stat.stat.name, stat.base_stat.toString()] as [string, string]).concat([["sum", statsSum]]))}
                />
            </Box>
            <Divider/>
            <Box>
                <Typography variant={"h6"}>Evolution</Typography>
                <EvolutionEntry
                    species={pokemonSpecies}
                    selectPokemonCallBack={selectPokemonCallBack}
                />
            </Box>


        </Stack>
    </Card>
}

export default MyPokemonComponent

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
            label={<EvolutionChainEntry
                species={evolvesTo.species.name}
                evolutionDetails={evolvesTo.evolution_details}
                selectPokemonCallBack={selectPokemonCallBack}/>
            }
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
    evolutionDetails: EvolutionDetail[]
    selectPokemonCallBack: (index: string) => void;
}

function EvolutionChainEntry(
    {
        species,
        evolutionDetails,
        selectPokemonCallBack
    }: EvolutionChainEntryProps) {
    let pokemon = useQuery<Pokemon>(createPokemonCall(species));
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }

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
            {evolutionDetails.length !== 0 ? <IconButton>
                <Info
                    onClick={handleOpen}
                ></Info>
            </IconButton> : null}

        </Stack>
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Card sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: "20px",
            }}>
                <Box sx={{
                    display: 'grid',
                    gap: 1,
                }}>
                    {evolutionDetails.map(detail => <EvolutionDetailEntry evolutionDetail={detail}/>)}
                </Box>
            </Card>
        </Modal>
    </Card>
}

type EvolutionDetailEntryProps = {
    evolutionDetail: EvolutionDetail
}


function EvolutionDetailEntry({evolutionDetail}: EvolutionDetailEntryProps): ReactElement {

    const formatLabel = (key: string) => {
        return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const renderValue = (value: any) => {
        if (typeof value === 'object' && value !== null) {
            return value.name || JSON.stringify(value);
        }
        return String(value);
    };

    return (
        <Card variant={"outlined"} style={{
            padding: "1vh",
            borderRadius: "10px 1px 1px 1px",
        }}>
            <Typography variant={"h6"}>Trigger: {evolutionDetail.trigger.name}</Typography>
            <Typography>
                {Object.entries(evolutionDetail).map(([key, value]) => {
                    if (!value || key === 'trigger' || value === false) {
                        return null;
                    }

                    return (
                        <Typography key={key}>
                            {formatLabel(key)}: {renderValue(value)}
                        </Typography>
                    );
                })}
            </Typography>
        </Card>
    );
}

export type SpriteEntry = {
    url: string;
    description: string;
};

/**
 * Extracts all sprite URLs along with a descriptive name based on their
 * location in the Pokemon object.
 */
export const getAllSpritesWithDescriptions = (sprites: Pokemon['sprites']): SpriteEntry[] => {
    const spriteEntries: SpriteEntry[] = [];

    const walk = (obj: any, path: string[] = []) => {
        // 1. If we found a string, it's a URL. Pair it with the path we took to get here.
        if (typeof obj === 'string') {
            spriteEntries.push({
                url: obj,
                // Join the keys with spaces and clean up hyphens for readability
                description: path.join(' ').replace(/-/g, ' ')
            });
            return;
        }

        // 2. If it's an object, keep digging, but pass the current key into the next 'walk'
        if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach((key) => {
                // Skip keys that don't add value (like 'versions' or 'other')
                // if you want cleaner descriptions
                const nextPath = [...path, key];
                walk(obj[key], nextPath);
            });
        }
    };

    walk(sprites);

    return spriteEntries;
};