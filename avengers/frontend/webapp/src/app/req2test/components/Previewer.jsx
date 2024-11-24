import Markdown from 'marked-react';
import { Button } from "@/app/components/ui/button"
import { Copy } from "lucide-react"


const formatGherkin = (text) => {
  // remove ```gherkin from the start and ``` from the end
  text = text.replace('```gherkin', '').replace('```', '');
  const lines = text.split('\n');
  const formattedLines = lines.map((line) => {
    if (line.startsWith('Feature:')) {
      // return 'Feature:' in red and bold and the rest of the line as is
      line = line.replace('Feature:', '<span class="text-red-600 font-bold">Feature:</span>');
    } else if (line.trim().startsWith('Scenario:')) {
      // return 'Scenario:' in green and bold and the rest of the line as is
      line = line.replace('  Scenario:', '&nbsp&nbsp<span class="text-green-700 font-bold">Scenario:</span>');
    } else if (line.trim().startsWith('Given')) {
      // return 'Given ' in blue and medium and the rest of the line as is
      line = line.replace('Given', '&nbsp&nbsp&nbsp&nbsp<span class="text-blue-600 font-medium">Given</span>');
    } else if (line.trim().startsWith('When')) {
      // return 'When ' in purple and medium and the rest of the line as is
      line = line.replace('When', '&nbsp&nbsp&nbsp&nbsp<span class="text-purple-600 font-medium">When</span>');
    } else if (line.trim().startsWith('Then')) {
      // return 'Then ' in orange and medium and the rest of the line as is
      line = line.replace('Then', '&nbsp&nbsp&nbsp&nbsp<span class="text-orange-600 font-medium">Then</span>');
    } else if (line.trim().startsWith('And')) {
      // return 'And ' in teal and medium and the rest of the line as is
      line = line.replace('And', '&nbsp&nbsp&nbsp&nbsp<span class="text-teal-500 font-medium">And</span>');
    }
    return line;
  });
  return formattedLines.join('<br>');
};

export default function Previewer(msg) {

    const customRenderer = {
      code: (code, lang) => {
        if (lang === 'gherkin') {
          return (
            <section
              className="my-2 p-3 bg-gray-200 dark:bg-gray-950 outline outline-gray-300 dark:outline-gray-700 rounded-md"
            >
              <Header code={code} />
              <div 
                key={Math.random()} 
                dangerouslySetInnerHTML={{ __html: formatGherkin(code) }} 
              />
            </section>
          )
        }
        return <pre><code>{code}</code></pre>;
      }
    };
      
    return(
        <Markdown value={msg.content} renderer={customRenderer} />
    )
}

const Header = ({ code }) => {
  return (
    <>
      <div className="px-1 flex justify-between items-center">
        <p className="text-md font-semibold italic">gherkin</p>
        <CopyButton code={code} />
      </div>
      <hr className="my-3 border-gray-500 w-full" />
    </>
  );
}


const CopyButton = ({ code }) => {

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };
  return (
    <Button
      className="inline-flex text-md gap-1 float-right p-1.5 text-black dark:text-white rounded-md outline outline-gray-500 transition-all ease-in-out hover:shadow-md bg-gray-100 dark:bg-gray-900 hover:bg-white dark:hover:bg-indigo-700"
      title='Copy to clipboard'
      onClick={handleCopy}
    >
      <Copy className="w-5 h-5" /> Copy
    </Button>
  );
}