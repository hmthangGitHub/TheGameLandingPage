# AI Agent

A standalone AI agent implemented in Node.js with the following skills:
- **Research**: Uses web search to gather information
- **Code Search**: Searches for code snippets on GitHub
- **Multi-step Task Execution**: Can break down and execute complex tasks

## Prerequisites

- Node.js (version 16 or higher)
- API Keys:
  - OpenAI API Key (for the LLM)
  - SerpAPI Key (for web search)
  - GitHub Personal Access Token (optional, for code search)

## Installation

1. Clone or download this repository
2. Run `npm install` to install dependencies

## Setup

1. Get your API keys:
   - [OpenAI API Key](https://platform.openai.com/api-keys)
   - [SerpAPI Key](https://serpapi.com/)
   - [GitHub Token](https://github.com/settings/tokens) (create a token with `repo` scope)

2. Set environment variables:
   ```bash
   export OPENAI_API_KEY="your-openai-api-key"
   export SERPAPI_API_KEY="your-serpapi-api-key"
   export GITHUB_TOKEN="your-github-token"  # Optional
   ```

   Or create a `.env` file in the project root:
   ```
   OPENAI_API_KEY=your-openai-api-key
   SERPAPI_API_KEY=your-serpapi-api-key
   GITHUB_TOKEN=your-github-token
   ```

## Running the Agent

```bash
npm start
```

The agent will start an interactive CLI. You can ask questions or give tasks, and it will use its tools to respond.

## Examples

- Research: "What is the current weather in New York?"
- Code Search: "Show me a Node.js example for reading files asynchronously"
- Multi-step Task: "Research the best practices for Node.js error handling and provide code examples"

Type 'exit' to quit the agent.

## Dependencies

- langchain: For agent framework
- @langchain/openai: OpenAI integration
- @langchain/community: Community tools
- zod: Schema validation
- node-fetch: HTTP requests