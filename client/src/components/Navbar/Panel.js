import { useHistory } from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { Timeline, GroupWork } from '@material-ui/icons';

const useStyles = makeStyles({
    list: {
        width: 250,
    }
});

const menuItems = [
    {
        title: 'Главная',
        path: '/'
    }, {
        title: 'Профиль',
        icon: <Timeline />,
        path: '/profile'
    }, {
        title: 'Категории',
        icon: <GroupWork />,
        path: '/categories'
    }
];

function Panel({ open, onClose }) {
    const classes = useStyles();
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
                        <ListItem button key={item.title} onClick={() => history.push(item.path)}>
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