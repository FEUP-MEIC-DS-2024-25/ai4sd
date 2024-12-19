import React from "react";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Create from "./components/spark/Create";
import Project from "./components/spark/Project";
import Login from "./components/account/Login";
import Signup from "./components/account/Signup";
import Profile from "./components/account/Profile";
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
            path="/create"
            element={
              <Layout>
                <Create />
              </Layout>
            }
          />
          <Route
            path="/project/:projectId"
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
