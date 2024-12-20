import React from "react";
import HomePage from "./HomePage";
import Footer from "./Footer";
import Header from "./Header";
import Create from "./spark/Create";
import Project from "./spark/Project";
import Login from "./account/Login";
import Signup from "./account/Signup";
import Profile from "./account/Profile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Layout Wrapper Component
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/spark/create"
            element={
              <Layout>
                <Create />
              </Layout>
            }
          />
          <Route
            path="/spark/:projectId"
            element={
              <Layout>
                <Project />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/signup"
            element={
              <Layout>
                <Signup />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/spark/create/"
            element={
              <Layout>
                <Create />
              </Layout>
            }
          />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
