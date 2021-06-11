import './App.css';
import Main from './pages/Main';
import Categories from './pages/Categories';
import Profile from './pages/Profile';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Switch>
                <Route path='/profile'>
                    <Profile />
                </Route>
                <Route path='/categories'>
                    <Categories />
                </Route>
                <Route path='/'>
                    <Main />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
