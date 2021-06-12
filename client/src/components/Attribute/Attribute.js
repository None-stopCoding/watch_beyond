import {Box, Typography} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {makeStyles, useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles({
    attributes: {
        '&:hover': {
            backgroundColor: props => props.disabled ? '' : props.theme.palette.primary.main
        },
        userSelect: 'none',
        opacity: props => props.disabled ? 0.4 : 1,
        cursor: 'pointer'
    },
    attributeName: {
        color: props => props.theme.palette.secondary.light
    },
    attributeActions: {
        '&:hover': {
            backgroundColor: props => props.theme.palette.secondary.main
        },
    }
});

function Attribute({ attribute, disabled, onClick }) {
    const classes = useStyles({ theme: useTheme(), disabled });

    return (
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
             position='relative'
             className={classes.attributes}
             onClick={onClick}
        >
            <Typography variant="subtitle1" className={classes.attributeName}>
                {attribute.name}
            </Typography>
            <Icon fontSize='large' color='secondary' >{attribute.icon}</Icon>
        </Box>
    )
}

export default Attribute;