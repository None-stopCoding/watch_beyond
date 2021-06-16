import { Container, Grid, Paper, Button, Fab, Tooltip } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Cached } from '@material-ui/icons';

import { Chart, Settings, Combined as AttributesGraphsCombined } from './../components';

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
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <Container className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12} container spacing={3}>
                    <Grid item xs={9}>
                        <Chart />
                    </Grid>
                    <Grid item xs={3} sm container direction='column' spacing={3}>
                        <Grid item style={{ height: 60 }}>
                            <Tooltip title="Анализ проводится каждую неделю. Однако можно проанализировать данные на текущий момент.">
                                <Fab variant="extended" style={{ backgroundColor: theme.palette.secondary.main }}>
                                    <Cached style={{ marginRight: 10 }}/>
                                    Провести анализ
                                </Fab>
                            </Tooltip>
                        </Grid>
                        <Grid item xs>
                            <Paper className={classes.graphSettings} elevation={4}>
                                <Settings content={{
                                    period: {
                                        items: {
                                            years: 'Год',
                                            months: 'Месяц',
                                            weeks: 'Неделя'
                                        },
                                        default: 'weeks'
                                    },
                                    slider: true,
                                    chips: true
                                }} onChange={console.error}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.staticInfo} elevation={4}>static info 1</Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.staticInfo} elevation={4}>static info 2</Paper>
                </Grid>
                <Grid item xs>
                    <AttributesGraphsCombined />
                </Grid>
            </Grid>
        </Container>
    );
}

export default Profile;