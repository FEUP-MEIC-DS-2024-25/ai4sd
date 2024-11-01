import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.css';
import styles from "./page.module.css";
import './globals.css';
import logo from "./pictures/logo.svg";

export default function Home() {
  return (
      <main className={styles.main}>
        <nav id="mainNav" className="navbar navbar-expand-md sticky-top navbar-dark" style={{borderBottom: "1px solid #EFEFEF", padding: 0 + "px"}}>
          <div className="container">
            <Image src={logo} alt="Logo" height={60} width={"100"} />
            <a className="navbar-brand d-flex align-items-center" href="/"></a>
            <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navcol-1">
              <span className="visually-hidden">Toggle navigation</span>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div id="navcol-1" className="collapse navbar-collapse">
              <ul className="navbar-nav mx-auto"></ul>
            </div>
            <div className="ul" style={{display: "inline-grid", gridGap: 30 + "px", gridTemplateColumns: "repeat(3, 1fr)"}}>
                <a href="#" >Home</a>
                <a href="#" >About</a>
                <a href="#" >Contact</a>
            </div>  
          </div>
        </nav>

        <div className="container" style={{minWidth: "100%", display: 'flex', flexDirection: "column", alignItems: "center", background: "linear-gradient(180deg, rgba(20,20,20,1) 8%, rgba(44,44,44,1) 100%);"}} >
          <Image src={logo} alt="Logo" height={215} width={600} style={{marginTop: 7.5 + "px"}} />
          <div className="row" style={{marginBottom: 30 + 'px'}}>
            <span style={{fontSize: 28 + "px", textAlign: "center"}}>
            Artificial Intelligence for <br/> Software Development
            </span>
          </div>
        </div>

        <div className="container" style={{backgroundColor: "white", height: "600px", minWidth: "100%"}}>

        </div>
        <footer className={styles.footer}>
        
      </footer>
      </main>
      
  );
}
