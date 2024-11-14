// Assets
import styles from "../page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import '../globals.css';

// Components
import NavBar from "../components/navbar";
import HeroBar from "../components/heroBar";
import FeaturedBar from "../components/featuredBar";
import AssistantList from "../components/assistantList";
import Footer from "../components/footer"

export default function Home() {
    return (
        <main className={styles.main} style={{ color: "none" }}>
            <NavBar />
            <HeroBar />
            <FeaturedBar />
            <AssistantList />
            <Footer />
        </main>
    );
}