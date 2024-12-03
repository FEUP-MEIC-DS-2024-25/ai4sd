export interface CodeComment {
    line: number;
    comment: string;
}

export function fullFileComments(document:string,response:string) {
    console.log("Full file comments");
    let cleanedComments = response.replace(/```/g, '').split('\n').slice(1, -1).join('\n');
    console.log(cleanedComments);
    const commentsJson = JSON.parse(cleanedComments);

    const comments: CodeComment[] = [];
    for (let i = 0; i < commentsJson.length; i++) {
        const comment = commentsJson[i];
        const className = comment.className;
        const methodName = comment.functionName;
        const modifiedComment = comment.documentation.replace(/\n/g, '\n#');
        const commentText = "#" + modifiedComment;
        const jsonComent = { line: findMethodLine(document, className, methodName), comment: commentText };
        comments.push(jsonComent);
    }
    return comments;
}




// Python parsing
function getIndentationLevel(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
}
// To deal with nested classes
function findMethodLine(document:string, className: string, methodName: string): number {
    const lines = document.split('\n');

    // Find class definition
    let inTargetClass = false;
    let classIndentation = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        const currentIndentation = getIndentationLevel(line);

        // Check for class definition
        if (trimmedLine.startsWith('class ') && trimmedLine.includes(className)) {
            inTargetClass = true;
            classIndentation = currentIndentation;
            continue;
        }

        // If we're in the target class, look for the method
        if (inTargetClass) {
            // Check if we're still in the class scope by comparing indentation
            if (trimmedLine.length > 0 && currentIndentation <= classIndentation) {
                inTargetClass = false;
                continue;
            }

            // Look for method definition
            if (trimmedLine.startsWith('def ') && trimmedLine.includes(methodName)) {
                // Verify it's not just a substring match
                const methodMatch = trimmedLine.match(/def\s+(\w+)\s*\(/);
                if (methodMatch && methodMatch[1] === methodName) {
                    return i;
                }
            }
        }
    }

    return -1; // Method not found
}