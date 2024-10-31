import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.css';
import styles from "./page.module.css";
import logo from "./pictures/logo.svg";

export default function Home() {
  return (
      <main className={styles.main}>
        <nav id="mainNav" className="navbar navbar-expand-md sticky-top py-3 navbar-dark">
          <div className="container">
            <Image src={logo} alt="Logo" height={50} width={50} />
            <a className="navbar-brand d-flex align-items-center" href="/"></a>
            <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navcol-1">
              <span className="visually-hidden">Toggle navigation</span>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div id="navcol-1" className="collapse navbar-collapse">
              <ul className="navbar-nav mx-auto"></ul>
            </div>
                <a href="#" style={{margin_left: 30 + "px"}}>Home</a>
                <a href="#" style={{margin_left: 30 + "px"}}>About</a>
                <a href="#" style={{margin_left: 30 + "px"}}>Contact</a>
          </div>
        </nav>


        <Image src={logo} alt="Logo" height={50} width={50} />
        <ol>



          <li>
            Get started by editing <code>src/app/page.js</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
      </main>
      
  );
}
