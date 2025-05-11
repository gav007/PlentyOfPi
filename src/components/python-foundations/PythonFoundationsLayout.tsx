
'use client';

import OnboardingCard from './OnboardingCard';
import LessonViewer from './LessonViewer';
import PythonSandbox from './PythonSandbox'; // Updated import
import GamifiedSection from './GamifiedSection';
import AssessmentLink from './AssessmentLink';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCode, Brain } from 'lucide-react'; // Added Brain for sandbox

export default function PythonFoundationsLayout() {
  // Placeholder lesson structure based on user's PDF scope
  const lessons = [
    {
      title: 'Module 1: Introduction to Python and Computer Programming',
      content: [
        { subTitle: 'Python - a tool, not a reptile', text: 'Understanding what Python is and its history.' },
        { subTitle: 'Compilation vs. Interpretation', text: 'Differences between compiled and interpreted languages.' },
        { subTitle: 'Machine vs. High-Level Languages', text: 'Exploring language levels.' },
        { subTitle: 'Syntax, Semantics, Lexis', text: 'The building blocks of a programming language.' },
      ],
    },
    {
      title: 'Module 2: Python Basics - Data Types, Variables, I/O, and Operators',
      content: [
        { subTitle: 'Your first program: print()', text: 'Writing "Hello, World!" and understanding output.' },
        { subTitle: 'Python literals and basic data types', text: 'Strings, integers, floats, booleans.' },
        { subTitle: 'Variables', text: 'Naming, creating, and using variables.' },
        { subTitle: 'Basic Input and Output', text: 'Using input() and advanced print() formatting.' },
        { subTitle: 'Operators', text: 'Arithmetic, assignment, comparison, and logical operators.' },
      ],
    },
    {
        title: 'Module 3: Control Flow - Conditional Execution and Loops',
        content: [
            { subTitle: 'Boolean values and conditional execution', text: 'Understanding True/False, if statements.' },
            { subTitle: 'The if-else and elif statements', text: 'Handling multiple conditions.' },
            { subTitle: 'Loops', text: 'while and for loops for iteration.' },
            { subTitle: 'Controlling loop execution', text: 'break, continue, and else in loops.' },
        ],
    },
    {
        title: 'Module 4: Data Collections and Functions',
        content: [
            { subTitle: 'Lists', text: 'Creating, indexing, slicing, methods (append, insert, pop, etc.).' },
            { subTitle: 'Tuples', text: 'Immutable sequences, when to use them.' },
            { subTitle: 'Dictionaries', text: 'Key-value pairs, methods (keys, values, items, get, etc.).' },
            { subTitle: 'Functions', text: 'Defining functions with def, parameters, return values, scope.' },
            { subTitle: 'Error Handling', text: 'Using try-except blocks for robust code.' },
        ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
          <FileCode className="w-10 h-10" />
          Python Foundations
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Your journey to mastering Python starts here. Prepare for the PCEP certification!
        </p>
      </header>

      <OnboardingCard />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <Brain className="w-6 h-6 text-primary" /> {/* Icon for sandbox */}
            Python Code Sandbox
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PythonSandbox />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Course Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <LessonViewer lessons={lessons} />
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Gamified Learning Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <GamifiedSection />
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Final Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <AssessmentLink />
        </CardContent>
      </Card>

    </div>
  );
}
