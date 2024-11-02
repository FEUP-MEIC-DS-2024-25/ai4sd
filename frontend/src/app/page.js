import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.css';
import styles from "./page.module.css";
import './globals.css';
import logo from "./pictures/logo.svg";
import Featured from "./featured.js";

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

        <div className="container" style={{display: "grid", padding: "20px 30px 20px 30px", gridTemplateColumns: "repeat(3, 1fr)", backgroundColor: "white", height: "400px", minWidth: "100%"}}>
          <Featured name="Archy" teamId="1MEIC01T2" description="Analyze local data such as commit logs and  documentation in software repositories and infer which patterns are present in source code." />
        </div>
        <footer className={styles.footer}>
        
      </footer>
      </main>
      
  );
}
