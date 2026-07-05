import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { SiteConfigProvider, SiteMeta } from "./context/SiteConfigContext";
import Header from "./components/Header";
import About from "./components/About";
import Services from "./components/Services";
import Advantages from "./components/Advantages";
import Portfolio from "./components/Portfolio";
import Calculator from "./components/Calculator";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import HowWork from "./components/HowWork";
import ServiceDetail from "./components/ServiceDetail.js";
import PrivacyPolicy from "./components/PrivacyPolicy.js";
import Reviews from "./components/Review.js";
import ModalDiscount from "./components/ModalDiscount";

function App() {
  return (
    <SiteConfigProvider>
      <SiteMeta />
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <About />
                  <Advantages />
                  <Services />
                  <Portfolio />

                  <Calculator />
                  <Contacts />
                  <HowWork />
                </>
              }
            />
            <Route path="/service/:serviceId" element={<ServiceDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
          <Footer />
          <ModalDiscount />
        </div>
      </Router>
    </SiteConfigProvider>
  );
}

export default App;
