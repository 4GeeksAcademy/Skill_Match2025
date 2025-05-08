import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import Home from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { Dashboard } from "./pages/Dashboard.js";
import { Profile } from "./pages/Profile.js";
import { Helpcenter } from "./pages/helpcenter";
import { ContactUs } from "./pages/contactus";
import { Historial } from "./pages/historial";
import { Admin } from "./pages/admin.js";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import Login from "./component/Login.jsx";
import Register from "./component/Register.jsx";
import EmployerProfile from "./component/EmployerProfile.jsx";
import FreelancerProfile from "./component/FreelancerProfile.jsx";
import ProfileForm from "./component/ProfileForm.jsx";
import DashboardFreelancer from "./component/DashboardFreelancer.jsx";
import DashboardProjects from "./component/DashboardProjects.jsx";
import PaymentPage from "./component/PaymentPage.jsx";
import EmployerForm from "./component/EmployerForm.jsx";
import SearchResults from "./component/SearchResults.jsx";
import FreelancerPublicProfile from "./component/FreelancerPublicProfile.jsx";



//create your first component
const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") {
        return <BackendURL />;
    }
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <div className="flex-grow-1">
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<EmployerProfile />} path="/employerProfile" />
                        <Route element={<FreelancerProfile />} path="/freelancerProfile" />
                        <Route element={<ProfileForm />} path="/profileform" />
                        <Route element={<DashboardFreelancer />} path="/DashboardFreelancer" />
                        <Route element={<DashboardProjects />} path="/DashboardProjects" />
                        <Route element={<Dashboard />} path="/Dashboard" />               
                        <Route element={<EmployerForm />} path="/employerForm" />
                        <Route path="*" element={<h1>Not found!</h1>} />
                        <Route element={<PaymentPage />} path="/payment/:proposalId" />
                        <Route element={<SearchResults />} path="/search" />
                        <Route element={<FreelancerPublicProfile />} path="/profile/:userId" />
                        <Route element={<Profile />} path="/Profile/:id" />
                        <Route element={<Admin />} path="/admin" />



                        


                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    </div>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);