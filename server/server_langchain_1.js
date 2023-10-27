import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";

const llm = new OpenAI({
  temperature: 0.9,
  openAIApiKey: "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",
});

const chatModel = new ChatOpenAI({
    temperature: 0.9,
    azureOpenAIApiKey: "ff538b2720be4177b30e099172951d97", // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    azureOpenAIApiVersion: "2023-05-15", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
    azureOpenAIApiInstanceName: "https://openaiexplorasius.openai.azure.com/", // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: "gpt-5-turbo", // In Node.js defaults to process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
  });

const text =
  "What would be a good company name for a company that makes colorful socks?";

//const llmResult = await llm.predict(text);
/*
  "Feetful of Fun"
*/

//const chatModelResult = await chatModel.predict(text);

/*
  "Socks O'Color"
*/