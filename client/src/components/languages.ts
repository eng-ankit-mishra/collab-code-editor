import type { Language } from "./Types";
import { FaJava } from "react-icons/fa";
import {
  SiC,
  SiCplusplus,
  SiGo,
  SiJavascript,
  SiKotlin,
  SiPython,
  SiRuby,
  SiRust,
} from "react-icons/si";

export const language: Language[] = [];

/* 🔒 Hardcoded correct aliases for Piston */
const ALIAS_MAP: Record<string, string> = {
  java: "java",
  "c++": "cpp",
  c: "c",
  javascript: "javascript",
  python: "python3",
  ruby: "ruby",
  go: "go",
  rust: "rust",
  kotlin: "kotlin",
};

const lang = [
  {
    label: "Java",
    icon: FaJava,
    color: "text-orange-600",
    boilerplate: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  },
  {
    label: "C++",
    icon: SiCplusplus,
    color: "text-blue-400",
    boilerplate: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  },
  {
    label: "C",
    icon: SiC,
    color: "text-cyan-400",
    boilerplate: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  },
  {
    label: "JavaScript",
    icon: SiJavascript,
    color: "text-yellow-400",
    boilerplate: `console.log("Hello, World!");`,
  },
  {
    label: "Ruby",
    icon: SiRuby,
    color: "text-red-400",
    boilerplate: `puts "Hello, World!"`,
  },
  {
    label: "Go",
    icon: SiGo,
    color: "text-blue-500",
    boilerplate: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
  },
  {
    label: "Rust",
    icon: SiRust,
    color: "text-orange-500",
    boilerplate: `fn main() {\n    println!("Hello, World!");\n}`,
  },
  {
    label: "Python",
    icon: SiPython,
    color: "text-blue-300",
    boilerplate: `print("Hello, World!")`,
  },
  {
    label: "Kotlin",
    icon: SiKotlin,
    color: "text-purple-400",
    boilerplate: `fun main() {\n    println("Hello, World!")\n}`,
  },
];

async function getRuntimes() {
  const res = await fetch("/api/languages");
  const data = await res.json();

  if (data) {
    const seen = new Set<string>();

    data.forEach(
      (runtime: {id: Number; name: string}) => {
        const langName = runtime.name.toLowerCase();
        const matchedLang = lang.find(
          (l) => l.label.toLowerCase() === langName
        );

        if (matchedLang && !seen.has(langName)) {
          seen.add(langName);

          language.push({
            id: runtime.id,
            name: matchedLang.label,
            alias:
              ALIAS_MAP[langName] ??
              langName,
            icon: matchedLang.icon,
            color: matchedLang.color,
            boilerplate: matchedLang.boilerplate,
          });
        }
      }
    );
  }
}

getRuntimes();
