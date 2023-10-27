import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { BaseOutputParser } from "langchain/schema/output_parser";


dotenv.config()

class CommaSeparatedListOutputParser extends BaseOutputParser<string[]> {
  async parse(text: string): Promise<string[]> {
    return text.split(",").map((item) => item.trim());
  }
}

const template = `You are an expert about busninesses and institutions in indonesia and the internet services and webpages they provide.`;

const humanTemplate = "{text}";

/**
 * Chat prompt for generating comma-separated lists. It combines the system
 * template and the human template.
 */
const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", template],
  ["human", humanTemplate],
]);

const chatModel = new ChatOpenAI({
    temperature: 0.1, // Higher values means the model will take more risks.
    max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
    top_p: 1, // alternative to sampling with temperature, called nucleus sampling
    frequency_penalty: 1.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
    presence_penalty: 0,
    azureOpenAIApiKey: "ff538b2720be4177b30e099172951d97", // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    azureOpenAIApiVersion: "2023-05-15", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
    azureOpenAIApiInstanceName: "openaiexplorasius", // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: "gpt-35-turbo", // In Node.js defaults to process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
  });

const chain = chatPrompt.pipe(chatModel).pipe(parser)

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello, I am  ASN Profiling AI Assistant!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    console.log(prompt)

    const response = await chain.invoke({
        text: prompt,
      });

    console.log(response)

    res.status(200).send({
      bot: response
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))