const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

async function main(){
  const client = new OpenAIClient(
  "https://your-azure-openai-resource.com/",
  new AzureKeyCredential("your-azure-openai-resource-api-key"));

  const { choices } = await client.getCompletions(
    "text-davinci-003", // assumes a matching model deployment or model name
    ["Hello, world!"]);

  for (const choice of choices) {
    console.log(choice.text);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});