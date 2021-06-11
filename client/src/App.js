import './App.css';
import { getTheme } from './utils';

import Main from './pages/Main';
import Attributes from './pages/Attributes';
import Profile from './pages/Profile';

import { Navbar } from './components';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';

function App() {
    return (
        <ThemeProvider theme={getTheme()}>
            <Router>
                <Navbar />
                <Switch>
                    <Route path='/profile'>
                        <Profile />
                    </Route>
                    <Route path='/attributes'>
                        <Attributes />
                    </Route>
                    <Route path='/'>
                        <Main />
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}

export default App;
