import {useContext} from "react"
import {AuthContext} from "../auth.context.jsx"
import {login, register, logout, getMe} from "../services/auth.api.js"
import {useEffect} from "react"

export const useAuth = () => {
    const {user, setUser, loading, setLoading} = useContext(AuthContext);

    async function handleLogin(email, password){
        setLoading(true);
        try {
            const data = await login({email, password});
            setUser(data.user);
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }       
    }

    async function handleRegister({username, email, password}) {
        setLoading(true);
        try {
            const data = await register({username, email, password});
            setUser(data.user);
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try{
                const data = await getMe();
                setUser(data.user);
            }
            catch(err){

            }finally{
                setLoading(false);
            }
        }
        getAndSetUser();
    }, []);

    return {user, loading, handleLogin, handleRegister, handleLogout};
}