// Assets
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import "@/app/globals.css";

// Components
import NavBar from "@/app/components/navbar";
import HeroBar from "@/app/components/heroBar";
import FeaturedBar from "@/app/components/featuredBar";
import AssistantList from "@/app/components/assistantList";
import Footer from "@/app/components/footer"

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