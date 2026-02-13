import {ReactElement, ReactNode, Suspense, useState} from "react";
import {Card, Grid2, Stack, Typography, useTheme} from "@mui/material";
import {MyPokedexComponent} from "./MyPokedexComponent";
import MyPokemonComponent from "./MyPokemonComponent";
import {MyNavigationMenu} from "./MyNavigationMenu";


const MainLayout = ({children}: { children: ReactNode }): ReactElement => {
    const theme = useTheme();
    return (
        <Stack alignItems="center">
            <Card
                style={{width: "700px"}}
                sx={{
                    height: "97vh",
                    width: "97vw",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: theme.palette.primary.light,
                }}
            >
                {children}
            </Card>
        </Stack>
    );
};

const LoadingState = () => (
    <Card variant="outlined">
        <Stack overflow="auto" height="85vh" spacing="0.5vh" sx={{padding: "1vh"}}>
            <Typography>Loading Pokemon...</Typography>
        </Stack>
    </Card>
);

export function MyMainPageComponent(): ReactElement {
    const [pokedexIndex, setPokedexIndex] = useState("national")
    const [selectedPokemon, setSelectedPokemon] = useState("bulbasaur")

    return (
        <MainLayout>
            <MyNavigationMenu
                pokedexIndex={pokedexIndex}
                onPokedexChange={setPokedexIndex}
                onPokemonChange={setSelectedPokemon}
            />

            <Grid2
                container
                spacing="0.5vw"
                sx={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    padding: "1vh",
                    flex: 1,
                }}
            >
                <Grid2>
                    <MyPokedexComponent
                        idOrName={pokedexIndex}
                        selectedPokemon={selectedPokemon}
                        selectPokemonCallBack={setSelectedPokemon}
                    />
                </Grid2>

                <Grid2 size="grow">
                    <Suspense fallback={<LoadingState/>}>
                        <MyPokemonComponent
                            idOrName={selectedPokemon}
                            selectPokemonCallBack={setSelectedPokemon}
                        />
                    </Suspense>
                </Grid2>
            </Grid2>
        </MainLayout>
    );
}

