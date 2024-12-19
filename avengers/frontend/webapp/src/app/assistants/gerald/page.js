
import 'bootstrap/dist/css/bootstrap.css';
import AI from './chat/page';
import '@/app/globals.css';
import Projects from './project/page';



export default function Interactor() {
    let cond = false
    if (cond) {
        return <AI></AI>
    }else{
        return <Projects></Projects>
    }
}

