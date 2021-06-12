import { useEffect, useState } from 'react';
import { Container, Grid, Divider } from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";

import { getAttributes } from '../service';
import { Attribute, Card } from '../components';

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

    const [attributeCard, toggleCard] = useState('');

    useEffect(() => {
        getAttributes({ companyId: 1, isUsed: true }).then(setUsedAttributes);
        getAttributes({ companyId: 1, isUsed: false }).then(setUnusedAttributes);
    }, []);

    return (
        <>
        <Container className={classes.root}>
            <Grid container spacing={3}>
                {
                    usedAttributes.map((attribute) =>
                        <Grid item xs={2} key={attribute.id}>
                            <Attribute attribute={attribute} onClick={() => toggleCard(attribute.id)}/>
                        </Grid>
                    )
                }
            </Grid>
            <Divider variant="middle" className={classes.divider}/>
            <Grid container spacing={3}>
                {
                    unusedAttributes.map((attribute) =>
                        <Grid item xs={2} key={attribute.id}>
                            <Attribute attribute={attribute} disabled onClick={() => toggleCard(attribute.id)}/>
                        </Grid>
                    )
                }
            </Grid>
        </Container>
        {
            attributeCard &&
            <Card attributeId={attributeCard}
                  onClose={() => toggleCard('')}/>
        }
        </>
    );
}

export default Attributes;