import NavBar from "../Navbar/NavBar";

export default function Header ({
    seeRegisterForm,
    seeLoginForm,
    seeHomepage,
    user,
    seeProfile,
    logout,
}) {
    return(
        <header>
            <NavBar 
                seeRegisterForm={seeRegisterForm}
                seeLoginForm={seeLoginForm}
                seeHomepage={seeHomepage}
                user={user}
                seeProfile={seeProfile}
                logout={logout}
            />
        </header>
    )
}

