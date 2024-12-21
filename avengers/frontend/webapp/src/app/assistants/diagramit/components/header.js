function Header({ title }) {
    return (
        <header className="p-4 flex items-center self-end">
            <div className="py-3 px-4 rounded-3" style={{background: "#02040F"}}>
                <h1 className="text-2xl tracking-widest font-semibold" style={{fontFamily: "Montserrat"}}>{title}</h1>
            </div>
        </header>
    );
};

export default Header;