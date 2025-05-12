
interface CodeSnippetProps {
  code: string;
}

export default function CodeSnippet({ code }: CodeSnippetProps) {
  return (
    <div className="p-4 bg-gray-800 text-green-300 font-mono rounded-md shadow-md overflow-x-auto">
      <h3 className="text-sm font-semibold text-gray-400 mb-2">Code Snippet:</h3>
      <pre className="whitespace-pre-wrap text-sm leading-relaxed">{code}</pre>
    </div>
  );
}
