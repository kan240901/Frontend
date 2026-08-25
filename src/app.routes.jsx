import {createBrowserRouter} from "react-router";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import ProtectedRoute from "./features/auth/components/protected.jsx";
import Home from "./features/interview/pages/Home.jsx"
import Interview from "./features/interview/pages/interview.jsx"

export const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/",
        element: <ProtectedRoute><Home/></ProtectedRoute>
    },
    {
        path: "/interview/:interviewId",
        element: <ProtectedRoute><Interview /></ProtectedRoute>
    }
]);