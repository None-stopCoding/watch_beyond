import { Container, Grid, Box, Typography } from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import { Wc, PermContactCalendar, EmojiEmotions } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.secondary.light,
        maxWidth: 1800,
        marginTop: 40
    },
    attributes: {
        '&:hover': {
            backgroundColor: theme.palette.primary.main
        }
    },
    attributeName: {
        color: theme.palette.secondary.light
    },
    attributeIcons: {
        color: 'primary',
        fontSize: 'large'
    }
}));

function Attributes() {
    const theme = useTheme();
    const classes = useStyles(theme);

    const getUsedAttributes = () => {
        return [{
            name: 'Пол',
            icon: <Wc fontSize='large' color='secondary' />
        }, {
            name: 'Возраст',
            icon: <PermContactCalendar fontSize='large' color='secondary' />
        }, {
            name: 'Эмоция',
            icon: <EmojiEmotions fontSize='large' color='secondary' />
        }];
    }

    return (
        <Container className={classes.root}>
            <Grid container spacing={3}>
                {
                    getUsedAttributes().map((attribute) =>
                        <Grid item xs={2} key={attribute.name}>
                            <Box border={1}
                                 borderRadius='50%'
                                 borderColor='primary.main'

                                 width={100}
                                 height={100}

                                 display='flex'
                                 flexDirection='column'
                                 justifyContent='center'
                                 alignItems='center'
                                 lineHeight={2}

                                 boxShadow={3}
                                 bgcolor='primary.light'
                                 className={classes.attributes}
                            >
                                <Typography variant="h7" className={classes.attributeName}>
                                    {attribute.name}
                                </Typography>
                                {attribute.icon}
                            </Box>
                        </Grid>
                    )
                }
            </Grid>
        </Container>
    );
}

export default Attributes;