const axios = require("axios");
const fs = require("fs");

// Axios instance for Jira REST API
const jiraAPI = axios.create({
  baseURL: "https://herocoders.atlassian.net/rest/api/3/",
  headers: {
    Accept: "application/json",
  },
});

// Function to get components of the Sample Project
async function getComponents() {
  try {
    const response = await jiraAPI.get("project/SP/components");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Function to get issues count by component
async function getIssuesCountByComponent(componentId) {
  try {
    const response = await jiraAPI.get(
      `search?jql=project=SP AND component=${componentId}`
    );
    return response.data.total;
  } catch (error) {
    console.error(error);
  }
}

// Main function
async function main() {
  const components = await getComponents();

  let output = "";
  for (const component of components) {
    if (!component.lead) {
      const issuesCount = await getIssuesCountByComponent(component.id);
      output += `Component: ${component.name}, Issues Count: ${issuesCount}\n`;
    }
  }

  // Write the output to a file
  fs.writeFileSync("output.txt", output);
}

main();
