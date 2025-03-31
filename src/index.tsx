import React, {Suspense, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {
    AppBar,
    Card,
    createTheme,
    Grid2,
    IconButton,
    Stack,
    ThemeProvider,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {MyDrawerComponent} from "./components/MyDrawerComponent";
import {MyPokedexComponent} from "./components/MyPokedexComponent";
import {MyPokemonComponent} from "./components/MyPokemonComponent";

const theme = createTheme({
    palette: {
        primary: {
            main: '#6157A3',
        }, secondary: {
            main: '#E0C2FF', light: '#F5EBFF', contrastText: '#47008F',
        }, background: {
            default: '#FFFFFF', paper: '#FFFFFF',
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<React.StrictMode>
    <ThemeProvider theme={theme}>
        <Body/>
    </ThemeProvider>
</React.StrictMode>)


function Body() {
    let theme = useTheme();
    const [pokedexIndex, setPokedexIndex] = useState("national")
    const [selectedPokemon, setSelectedPokemon] = useState("bulbasaur")

    return <Stack
        alignItems={"center"}
    >
        <Card style={{
            height: "97vh",
            width: "97vw",
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.palette.primary.light,
        }}>
            <div>
                <Menu
                    selectDexCallBack={setPokedexIndex}
                    selectedDex={pokedexIndex}
                    selectedPokemonCallBack={setSelectedPokemon}
                />
            </div>
            <Grid2
                container
                direction="row"
                spacing={"0.5vw"}
                sx={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    padding: "1vh",
                }}
            >
                <Grid2>
                    <MyPokedexComponent
                        idOrName={pokedexIndex}
                        selectedPokemon={selectedPokemon}
                        selectPokemonCallBack={setSelectedPokemon}
                    />
                </Grid2>
                <Grid2 size={"grow"}>
                    <Suspense
                        fallback={<Card
                            variant={"outlined"}
                        >
                            <Stack
                                overflow={"auto"}
                                height={"85vh"}
                                spacing={"0.5vh"}
                                style={{padding: "1vh"}}
                            >
                                <Typography>Loading Pokemon...</Typography>
                            </Stack>

                        </Card>}
                    >
                        <MyPokemonComponent
                            idOrName={selectedPokemon}
                            selectPokemonCallBack={setSelectedPokemon}
                        />
                    </Suspense>
                </Grid2>
            </Grid2>

        </Card>
    </Stack>
}

type MenuProps = {
    selectDexCallBack: (index: string) => void;
    selectedPokemonCallBack: (index: string) => void;
    selectedDex: string;
}

function Menu(menuProps: MenuProps) {
    let [drawerOpen, setDrawer] = useState(false);

    return <div>
        <AppBar position={"sticky"} style={{height: "8vh"}}>
            <Toolbar>
                <IconButton
                    size="large"
                    color="inherit"
                    onClick={() => setDrawer(!drawerOpen)}
                >
                    <MenuIcon></MenuIcon>
                </IconButton>
                <Typography>Pokedex</Typography>
            </Toolbar>
        </AppBar>
        <MyDrawerComponent
            drawerOpen={drawerOpen}
            onClose={() => setDrawer(false)}
            selectDexCallBack={menuProps.selectDexCallBack}
            selectedPokemonCallBack={menuProps.selectedPokemonCallBack}
            selectedDex={menuProps.selectedDex}
        />
    </div>
}






