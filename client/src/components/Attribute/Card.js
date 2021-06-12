import {Modal, Backdrop, Box} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import {useEffect, useState} from "react";

import { getAttributeById } from '../../service'

const useStyles = makeStyles((theme) => ({
    modalContent: {
        height: '100%',
        minWidth: 1000,

        position: 'absolute',
        right: 0,
        backgroundColor: theme.palette.secondary.light
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function Card({ attributeId, onClose }) {
    const classes = useStyles();
    const [attribute, setAttribute] = useState();

    useEffect(() => {
        getAttributeById({ id: attributeId }).then(setAttribute);
    }, [])

    return (
        <>
        <Modal
            open={!!attribute}
            onClose={onClose}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            <Box display='flex'
                 alignItems='center'
                 justifyContent='center'
                 className={classes.modalContent}
            >
                {attribute?.name}
            </Box>
        </Modal>
        </>
    )
}

export default Card;