import React from 'react';
import ReactDOM from 'react-dom/client';
import {createTheme, ThemeProvider} from "@mui/material";
import {MyMainPageComponent} from "./components/MyMainPageComponent";

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
        <MyMainPageComponent/>
    </ThemeProvider>
</React.StrictMode>)











