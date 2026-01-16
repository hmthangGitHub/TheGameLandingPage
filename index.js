import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import * as readline from "readline";

// Set up environment variables (replace with your API keys)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "your-openai-api-key";
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY || "your-serpapi-api-key";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "your-github-token"; // Optional for GitHub API

// Custom tool for code search using GitHub API
const codeSearchTool = tool(
  async ({ query }) => {
    try {
      const response = await fetch(`https://api.github.com/search/code?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const results = data.items.slice(0, 5).map(item => ({
          name: item.name,
          path: item.path,
          repository: item.repository.full_name,
          url: item.html_url,
          snippet: item.text_matches ? item.text_matches[0].fragment : 'No snippet available'
        }));
        return JSON.stringify(results, null, 2);
      } else {
        return "No code results found.";
      }
    } catch (error) {
      return `Error searching code: ${error.message}`;
    }
  },
  {
    name: "code_search",
    description: "Search for code snippets on GitHub using a query. Useful for finding examples or implementations.",
    schema: z.object({
      query: z.string().describe("The search query for code, e.g., 'Node.js web server example'")
    })
  }
);

// Initialize the model
const model = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0,
  openAIApiKey: OPENAI_API_KEY
});

// Define tools
const tools = [
  new SerpAPI({
    apiKey: SERPAPI_API_KEY,
    location: "United States",
    hl: "en",
    gl: "us"
  }),
  codeSearchTool
];

// Create the agent executor
const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: "zero-shot-react-description",
  verbose: true
});

console.log("AI Agent initialized with Research, Code Search, and Multi-step Task Execution skills.");
console.log("Available commands:");
console.log("- Research: Ask questions that require web search");
console.log("- Code Search: Ask for code examples or implementations");
console.log("- Multi-step Tasks: Provide complex tasks that the agent can break down");
console.log("Type 'exit' to quit.\n");

// Set up readline for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion() {
  rl.question("You: ", async (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log("Goodbye!");
      rl.close();
      return;
    }

    try {
      const result = await executor.invoke({ input });
      console.log("Agent:", result.output);
    } catch (error) {
      console.error("Error:", error.message);
    }

    askQuestion();
  });
}

askQuestion();