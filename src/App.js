import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import AboutPage from './pages/AboutPage';
import ArticlePage from './pages/ArticlePage';
import ArticleListPage from './pages/ArticleListPage';

import './App.css';
import NavBar from './NavBar.js';
import NotFoundPage from './pages/NotFoundPage.js';

function App() {
  return (
    <Router> {/* Makes sure that our entire app stays upto date with browser's current URL */}
      <div className="App">
        <NavBar />

        <div id='page-body'>

          <Switch> {/* It is used to make sure that only 1 component is displayed at a time. That is why NOTFOUNDPAGE should be displayed 
                        at last because we do not give it a path and hence it always matches */}

            {/* Takes in 2 components, 1 path and other is component. In order that "/" does not match any other path, we use "exact" */}
            <Route path="/" component={HomePage} exact />
            <Route path="/about" component={AboutPage} />
            <Route path="/articles-list" component={ArticleListPage} />

            {/* ":name" is a URL Parameter. Basically "name" is a variable which gets passed as a prop to the component. */}
            <Route path="/article/:name" component={ArticlePage} />

            <Route component={NotFoundPage} />

          </Switch>

        </div>

      </div>
    </Router>

  );
}

export default App;
