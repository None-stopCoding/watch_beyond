import { useHistory } from 'react-router-dom';

import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import MuiListItem from "@material-ui/core/ListItem";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { Timeline, GroupWork } from '@material-ui/icons';

const useStyles = makeStyles({
    list: {
        width: 250
    }
});

const ListItem = withStyles(({ palette }) => ({
    root: {
        '&:hover': {
            backgroundColor: palette.secondary.main,
            color: palette.secondary.contrastText
        }
    },
    selected: {}
}))(MuiListItem);

const menuItems = [
    {
        title: 'Главная',
        path: '/'
    }, {
        title: 'Профиль',
        icon: <Timeline />,
        path: '/profile'
    }, {
        title: 'Признаки',
        icon: <GroupWork />,
        path: '/attributes'
    }
];

function Panel({ open, onClose }) {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();

    return (
        <Drawer anchor='left' open={open} onClose={onClose}>
            <div
                className={classes.list}
                role="presentation"
                onClick={onClose}
                onKeyDown={onClose}
            >
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem button
                                  {...{ theme }}
                                  key={item.title}
                                  onClick={() => history.push(item.path)}>
                            <ListItemIcon> { item.icon } </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItem>
                    ))}
                </List>
            </div>
        </Drawer>
    );
}

export default Panel;