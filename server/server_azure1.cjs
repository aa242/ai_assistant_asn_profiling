
/** 
import express, { response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi} from 'azure-openai';

dotenv.config();


//const configuration = new Configuration({
//    apiKey: process.env.OPENAI_API_KEY,
//});



this.openAiApi = new OpenAIApi(
    new Configuration({
       apiKey: this.apiKey,
       // add azure info into configuration
       azure: {
          apiKey: 'ff538b2720be4177b30e099172951d97',
          endpoint: 'https://openaiexplorasius.openai.azure.com/',
          // deploymentName is optional, if you donot set it, you need to set it in the request parameter
          deploymentName: 'gpt-5-turbo',
       }
    }),
 );

const app = express();

app.use(cors());

app.use(express.json);

app.get('/', async(req, res) => {
    res.status(200).send({
        message: 'Hello from AI Assistant....',
    })
});

app.post('/', async (req,res) => {
    try {
        const prompt = req.body.prompt;

        const response = await this.openAiApi.createCompletion({
            model: "gpt-5-turbo",
            prompt: `${prompt}`,
            temperature: 0, // Higher values means the model will take more risks.
            max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
            top_p: 1, // alternative to sampling with temperature, called nucleus sampling
            frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
            presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({error})
    }
})

app.listen(5000, () => console.log('Server is running http://localhost:5000'))


*/


 

const { OpenAIClient } = require("@azure/openai");
const { DefaultAzureCredential } = require("@azure/identity")

async function main(){
  const endpoint ="https://openaiexplorasius.openai.azure.com/";
  const client = new OpenAIClient(endpoint, new AzureKeyCredential("ff538b2720be4177b30e099172951d97"));

  const textToSummarize = `
    Two independent experiments reported their results this morning at CERN, Europe's high-energy physics laboratory near Geneva in Switzerland. Both show convincing evidence of a new boson particle weighing around 125 gigaelectronvolts, which so far fits predictions of the Higgs previously made by theoretical physicists.

    ""As a layman I would say: 'I think we have it'. Would you agree?"" Rolf-Dieter Heuer, CERN's director-general, asked the packed auditorium. The physicists assembled there burst into applause.
  :`;

  const summarizationPrompt = [`
    Summarize the following text.

    Text:
    """"""
    ${textToSummarize}
    """"""

    Summary:
  `];

  console.log(`Input: ${summarizationPrompt}`);

  const deploymentName = "text-davinci-003";

  const { choices } = await client.getCompletions(deploymentName, summarizationPrompt, {
    maxTokens: 64
  });
  const completion = choices[0].text;
  console.log(`Summarization: ${completion}`);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
