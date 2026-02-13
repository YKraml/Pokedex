import {ReactElement, useState} from "react";
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import {MyDrawerComponent} from "./MyDrawerComponent";

type NavigationMenuProps = {
    pokedexIndex: string;
    onPokedexChange: (id: string) => void;
    onPokemonChange: (id: string) => void;
}

export function MyNavigationMenu({pokedexIndex, onPokedexChange, onPokemonChange}: NavigationMenuProps): ReactElement {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <AppBar position="sticky" sx={{height: "8vh"}}>
                <Toolbar>
                    <IconButton
                        size="large"
                        color="inherit"
                        onClick={() => setIsOpen(true)}
                    >
                        <Typography variant="h6">☰</Typography>
                    </IconButton>
                    <Typography variant="h6">Pokedex</Typography>
                </Toolbar>
            </AppBar>

            <MyDrawerComponent
                drawerOpen={isOpen}
                onClose={() => setIsOpen(false)}
                selectDexCallBack={onPokedexChange}
                selectedPokemonCallBack={onPokemonChange}
                selectedDex={pokedexIndex}
            />
        </>
    );
}