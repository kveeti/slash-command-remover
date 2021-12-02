import axios from "axios";
import config from "./config.js";

const auth = {
  Authorization: `Bot ${config.token}`,
};

const apiUrl = "https://discord.com/api/v9";

const ctrlc = "\n\nCTRL + C:ing...";

const getBotOwner = async () => {
  try {
    const res = await axios.get(`${apiUrl}/oauth2/applications/@me`, {
      headers: auth,
    });

    if (!res.data) {
      console.log(`\nI think you gave me the wrong token :(${ctrlc}\n`);

      return null;
    }

    const owner = res.data.owner.username + "#" + res.data.owner.discriminator;
    return owner;
  } catch (err) {
    if (!err.response) {
      console.log("Didn't get a response from Discord!" + ctrlc);

      return null;
    }

    console.log(`\nHey! You gave me the wrong token :(${ctrlc}\n`);

    return null;
  }
};

const getBot = async () => {
  try {
    const res = await axios.get(`${apiUrl}/users/@me`, {
      headers: auth,
    });

    const botName = `${res.data.username}#${res.data.discriminator}`;

    return botName;
  } catch {
    return null;
  }
};

const deleteCommands = async () => {
  await axios({
    method: "PUT",
    url: `${apiUrl}/applications/${config.userId}/commands`,
    headers: auth,
    data: [],
  });
};

const configExists = () => {
  if (config.userId === "" || config.token === "" || !config || !config.userId || !config.token) {
    return false;
  }

  return true;
};

const getCommands = async () => {
  try {
    const res = await axios({
      url: `${apiUrl}/applications/${config.userId}/commands`,
      headers: auth,
    });

    return res.data;
  } catch (err) {
    if (!err.response) {
      console.log("Didn't get response from Discord!" + ctrlc + "\n");
      return false;
    }

    console.log(`\nHey! You gave me the wrong user id :(${ctrlc}\n`);
    return false;
  }
};

(async () => {
  if (!configExists()) return console.log(`\nHey! You should check your config.js!${ctrlc}\n`);

  const owner = await getBotOwner();
  const bot = await getBot();

  if (!owner || !bot) return;

  const commands = await getCommands();

  if (!commands) return;

  console.log("\nBOT INFO:\n");
  console.log(`  Bot: ${bot}`);
  console.log(`  Owner: ${owner}\n`);

  if (!commands.length)
    return console.log(`\nYour bot does not have any slash commands registered!${ctrlc}\n`);

  console.log(`\nFound ${commands.length} slash command${commands.length > 1 ? "s" : ""}\n`);

  await deleteCommands();

  console.log(`\nFinished! Have a nice day :)\n`);
})();
