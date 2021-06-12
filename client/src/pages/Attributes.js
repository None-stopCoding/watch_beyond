import { useEffect, useState } from 'react';
import { Container, Grid, Box, Typography, Divider } from "@material-ui/core";
import Icon from '@material-ui/core/Icon';
import {makeStyles, useTheme} from "@material-ui/core/styles";

import { getAttributes } from '../service';
import { Attribute } from '../components';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.secondary.light,
        maxWidth: 1800,
        marginTop: 40
    },
    divider: {
        marginTop: 50,
        marginBottom: 50,
        width: '50%'
    }
}));

function Attributes() {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [usedAttributes, setUsedAttributes] = useState([]);
    const [unusedAttributes, setUnusedAttributes] = useState([]);

    useEffect(() => {
        getAttributes({ companyId: 1, isUsed: true }).then(setUsedAttributes);
        getAttributes({ companyId: 1, isUsed: false }).then(setUnusedAttributes);
    }, []);

    return (
        <Container className={classes.root}>
            <Grid container spacing={3}>
                {
                    usedAttributes.map((attribute) =>
                        <Grid item xs={2} key={attribute.name}>
                            <Attribute attribute={attribute} />
                        </Grid>
                    )
                }
            </Grid>
            <Divider variant="middle" className={classes.divider}/>
            <Grid container spacing={3}>
                {
                    unusedAttributes.map((attribute) =>
                        <Grid item xs={2} key={attribute.name}>
                            <Attribute attribute={attribute} disabled />
                        </Grid>
                    )
                }
            </Grid>
        </Container>
    );
}

export default Attributes;