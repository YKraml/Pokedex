import React, {ReactElement, useEffect, useMemo, useState} from "react";
import {IconButton, Stack, Typography} from "@mui/material";

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {Pokemon} from "../../api/types/pokemon/Pokemon";


type MySpriteComponentProps = {
    pokemon: Pokemon
}

export function MySpriteComponent({pokemon}: MySpriteComponentProps): ReactElement {
    const [spriteIndex, setSpriteIndex] = useState(0);

    // Collect all sprites after getting a new Pokémon
    const spritesWithDescriptions = useMemo(() => {
        return getAllSpritesWithDescriptions(pokemon.sprites);
    }, [pokemon]);

    // Set sprite to default after getting a new Pokémon
    useEffect(() => {
        const officialUrl = pokemon.sprites.other["official-artwork"].front_default;
        const index = spritesWithDescriptions.findIndex(s => s.url === officialUrl);
        setSpriteIndex(index);
    }, [pokemon, spritesWithDescriptions]);

    const length = spritesWithDescriptions.length;
    const currentIndex = ((spriteIndex % length) + length) % length;
    const currentSprite = spritesWithDescriptions[currentIndex];

    return (
        <Stack alignItems="center" direction="column">
            <Stack alignItems="center" direction="row">
                <IconButton onClick={() => setSpriteIndex(prev => prev - 1)} color="primary">
                    <ArrowBackIosIcon/>
                </IconButton>
                <img
                    style={{borderStyle: "hidden", objectFit: "contain"}}
                    width="200px"
                    height="200px"
                    src={currentSprite.url}
                    alt={currentSprite.description}
                />
                <IconButton onClick={() => setSpriteIndex(prev => prev + 1)} color="primary">
                    <ArrowForwardIosIcon/>
                </IconButton>
            </Stack>
            <Typography variant="subtitle2">
                {currentSprite.description}
            </Typography>
        </Stack>
    );
}


type SpriteEntry = {
    url: string;
    description: string;
};

/**
 * Extracts all sprite URLs along with a descriptive name based on their
 * location in the Pokémon object.
 */
const getAllSpritesWithDescriptions = (sprites: Pokemon['sprites']): SpriteEntry[] => {
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