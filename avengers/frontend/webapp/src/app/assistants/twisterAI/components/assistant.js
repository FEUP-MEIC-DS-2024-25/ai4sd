import styles from "@/app/page.module.css";
import "./assistant.css"

export default function Assistant() {
    
  return (
    <div className="TwisterAI">
      <header>
        <div>
          <h1 className="title">TwisterAI</h1>
        </div>
        <div>
          <nav>
            <label>Select the language:</label>
            <select id="language">
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </nav>
        </div>
      </header>
      <main>
        <section>
          <div>
            <label className="upload" htmlFor="code-file">
              Upload code file<i className="fa-solid fa-paperclip"></i>
            </label>
            <input
                className="upload_btn"
                type="file"
                // onChange={(e) => handleFileChange(e, 'code')}
                />
          </div>
          <div>
            <label className="upload" htmlFor="tests-file">
              Upload tests file<i className="fa-solid fa-paperclip"></i>
            </label>
            <input
                className="upload_btn"
                type="file"
                 // onChange={(e) => handleFileChange(e, 'test')}
                />
          </div>
        </section>

        <section>
            <label htmlFor="context">Give me some context about your code:</label>
            <textarea id="context" placeholder="Insert context here."></textarea>
        </section>

        <section>
            <button>Generate mutant tests</button> 
            <button>Download mutant tests</button>
        </section>

      </main>
    </div>
  );
}