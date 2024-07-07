const {
    TelegramClient,
    Api
} = require("telegram");
const {
    StringSession
} = require("telegram/sessions");
const input = require('input');
const fs = require('fs');
const path = require('path');

const apiId = 23646692;
const apiHash = 'ce9d84eb1daf3beeb5238f56ba758a80';
const stringSession = new StringSession("");
const sessionTxtPath = path.join(__dirname, 'session.txt');

const triggerWords = ['дизайн', 'design'];

const receiver = new Api.InputPeerChat({
    chatId: 7212979677,
    accessHash: '3072269181463061064'
});

const chatId = 4256035475;

async function getSession() {
    if (fs.existsSync(sessionTxtPath)) {
        return new StringSession(fs.readFileSync(sessionTxtPath, 'utf8'));
    } else {
        return new StringSession("");
    }
}

function checkWords(wordsArray, stringToCheck) {

    const regexPattern = wordsArray.map(word => `(${word})`).join('|');
    const regex = new RegExp(regexPattern, 'i');

    return regex.test(stringToCheck);
}
(async () => {
    const stringSession = await getSession();
    console.log("Loading interactive example...");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });
    if (fs.existsSync(sessionTxtPath)) {
        await client.start({
            phoneNumber: async () => await input.text("Please enter your number: "),
            password: async () => await input.text("Please enter your password: "),
            phoneCode: async () => await input.text("Please enter the code you received: "),
            onError: (err) => console.log(err),
        });

        fs.writeFileSync(sessionTxtPath, client.session.save());
    } else {
        await client.connect();
    }


    console.log("You are now connected.");
    console.log(`StringSession: ${client.session.save()}`);

    client.addEventHandler(async (event) => {
        const message = event.message;
        const chat = await client.getEntity(message.chatId);

        const user = await client.getEntity('checkerdesignlab');

        if (checkWords(triggerWords, message.message)) {
            try {
                if (message) {
                    //const link = `https://t.me/c/${message.peerId.channelId.value}/${message.id}`
                            console.log('message');
                        await client.sendMessage(receiver, {
                            message: `${'link'}`
                        });
                } else {
                    const link = `https://t.me/c/${message.peerId.channelId.value}/${message.id}`
      
                    // await client.sendMessage(receiver, {
                    //     message: `${link}`
                    // });
                    

                }
            } catch (error) {
                console.error(`Failed to get sender entity: ${error.message}`);
            }
        }


    }, new TelegramClient.events.NewMessage({}));

})();