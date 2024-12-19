
import 'bootstrap/dist/css/bootstrap.css';
import AI from './ai';
import '@/app/globals.css';
import Projects from './projects';



export default function Interactor() {
    let cond = false
    if (cond) {
    return (
        <AI></AI>
    )
    }
    else{
        return  <Projects></Projects>
    }

}

