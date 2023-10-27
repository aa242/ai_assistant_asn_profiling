import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";

dotenv.config()

const chatModel = new ChatOpenAI({
    temperature: 0.9,
    azureOpenAIApiKey: "ff538b2720be4177b30e099172951d97", // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    azureOpenAIApiVersion: "2023-05-15", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
    azureOpenAIApiInstanceName: "openaiexplorasius", // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: "gpt-35-turbo", // In Node.js defaults to process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
  });

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

    const response = await chatModel.predict(prompt);

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