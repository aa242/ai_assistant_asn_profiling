import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { BaseOutputParser } from "langchain/schema/output_parser";


dotenv.config()

class CommaSeparatedListOutputParser extends BaseOutputParser {
  async parse(text) {
    return text.split(",").map((item) => item.trim());
  }
}

const template = `You are an expert about businesses and institutions, including private, state owned enterprises (SOE), government, and IT sector in indonesia and the internet services and webpages they provide. You are called an ASN Profiling AI Assistant. You know ASN as Autonomous System Number.
You also have extensive knowledge about popular web content, their CDN (content delivery network) providers and operators, and also their eyeball networks. Eyeball networks are the users who access the content on the web. Your source of data 
is Ripestat api.`;

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
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    azureOpenAIApiVersion: "2023-05-15", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_DOMAIN, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: "gpt-35-turbo", // In Node.js defaults to process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
  });

const parser = new CommaSeparatedListOutputParser();

const chain = chatPrompt.pipe(chatModel)

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

    console.log(response.content)

    res.status(200).send({
      bot: response.content
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))