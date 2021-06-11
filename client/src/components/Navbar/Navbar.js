import React, { useState } from 'react';
import { useLocation } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Panel from './Panel';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        userSelect: 'none'
    },
}));

function Navbar() {
    const classes = useStyles();
    const location = useLocation();
    const [drawerShown, toggleDrawer] = useState(false);

    return (
        <>
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start"
                            className={classes.menuButton}
                            onClick={() => toggleDrawer(true)}
                            color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    { getTitle(location.pathname) }
                </Typography>
                <Button color="inherit">Войти</Button>
            </Toolbar>
        </AppBar>
        <Panel open={drawerShown} onClose={() => toggleDrawer(false)}/>
        </>
    );
}

/**
 * Отдает заголовок страницы в засимости от ее url-а
 */
const getTitle = (path) => {
    switch(path) {
        case '/profile': return 'Профиль';
        case '/categories': return 'Категории';
        default: return 'Watch Beyond';
    }
}

export default Navbar;