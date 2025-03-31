import {
    Card,
    Collapse,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListSubheader,
    Typography,
    useTheme
} from "@mui/material";
import React, {useState} from "react";
import {useQuery} from "../UseQuery";
import {
    createVersionGroupCall,
    VersionGroup
} from "../api/types/games/VersionGroups";
import {createPokedexCall, Pokedex} from "../api/types/games/Pokedex";

type DrawerProps = {
    drawerOpen: boolean,
    onClose: () => void
    selectedDex: string
    selectDexCallBack: (index: string) => void
    selectedPokemonCallBack: (index: string) => void;
}

const NUMBER_OF_VERSION_GROUPS = 27;

export function MyDrawerComponent(drawerProps: DrawerProps) {
    const theme = useTheme();

    const indices = Array.from(new Array(NUMBER_OF_VERSION_GROUPS), (x, i) => i + 1)

    return <Drawer
        open={drawerProps.drawerOpen}
        onClose={drawerProps.onClose}
    >
        <List
            sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Game versions and dexes
                </ListSubheader>
            }
        >
            <div style={{paddingLeft: "5px", paddingRight: "5px"}}>
                <Card variant={"outlined"}>
                    <PokedexEntry
                        pokedexName={"national"}
                        selected={drawerProps.selectedDex === "national"}
                        selectDexCallBack={drawerProps.selectDexCallBack}
                        standardBackGround={theme.palette.background.default}
                        selectedPokemonCallBack={drawerProps.selectedPokemonCallBack}
                    />
                </Card>
            </div>
            {indices.map(generation =>
                <div style={{padding: "5px"}}>
                    <VersionGroupEntry
                        index={generation}
                        selectDexCallBack={drawerProps.selectDexCallBack}
                        selectedDex={drawerProps.selectedDex}
                        selectedPokemonCallBack={drawerProps.selectedPokemonCallBack}
                    />
                </div>
            )}
        </List>

    </Drawer>
}

type VersionGroupEntryProps = {
    index: number
    selectedDex: string
    selectDexCallBack: (index: string) => void
    selectedPokemonCallBack: (index: string) => void;
}

function VersionGroupEntry(
    {
        index,
        selectDexCallBack,
        selectedDex,
        selectedPokemonCallBack
    }: VersionGroupEntryProps) {
    let versionGroup = useQuery<VersionGroup>(createVersionGroupCall(index));
    let palette = useTheme().palette;
    let color = versionGroup.pokedexes.map(pokedex => pokedex.name).find(dex => dex === selectedDex) ? palette.secondary.light : palette.background.default;

    return <Card
        variant={"outlined"}
        style={{backgroundColor: color}}
    >
        <Collapse in={true}>
            <List
                subheader={
                    <ListSubheader
                        style={{backgroundColor: color}}
                    >
                        {versionGroup.name}
                    </ListSubheader>
                }
            >
                <Divider/>
                {versionGroup.pokedexes.map((pokedex, i) => {
                    return <PokedexEntry
                        pokedexName={pokedex.name}
                        selected={pokedex.name === selectedDex}
                        selectDexCallBack={selectDexCallBack}
                        standardBackGround={color}
                        selectedPokemonCallBack={selectedPokemonCallBack}
                    />
                })}
                <Divider/>
            </List>
        </Collapse>

    </Card>
}

type PokedexEntryProps = {
    pokedexName: string
    selected: boolean
    selectDexCallBack: (index: string) => void
    standardBackGround: string
    selectedPokemonCallBack: (index: string) => void;
}

function PokedexEntry(
    {
        pokedexName,
        selected,
        selectDexCallBack,
        standardBackGround,
        selectedPokemonCallBack
    }: PokedexEntryProps) {
    let [isHovered, setHovered] = useState(false);
    let pokedex = useQuery<Pokedex>(createPokedexCall(pokedexName));
    let palette = useTheme().palette;

    return <ListItemButton
        sx={{pl: 4}}
        style={{
            backgroundColor: selected ? palette.secondary.main : isHovered ? palette.secondary.light : standardBackGround
        }}
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
            selectDexCallBack(pokedexName);
            selectedPokemonCallBack(pokedex.pokemon_entries.at(0)!.pokemon_species.name);
        }}>
        <Typography>{pokedexName}</Typography>
    </ListItemButton>


}