import { Container, Grid, Paper, Button } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { Chart } from './../components';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.secondary.light,
        maxWidth: 1800,
        marginTop: 40
    },
    graph: {
        height: 500
    },
    graphSettings: {
        height: '100%'
    },
    staticInfo: {
        height: 250
    }
}));

function Profile() {
    const classes = useStyles(useTheme());

    return (
        <Container className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12} container spacing={3}>
                    <Grid item xs={9}>
                        <Chart />
                    </Grid>
                    <Grid item xs={3} sm container direction='column' spacing={3}>
                        <Grid item style={{ height: 50 }}>
                            <Button>Обновить</Button>
                        </Grid>
                        <Grid item xs>
                            <Paper className={classes.graphSettings} elevation={4}>graph settings</Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.staticInfo} elevation={4}>static info 1</Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.staticInfo} elevation={4}>static info 2</Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Profile;