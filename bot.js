const { Client } = require('whatsapp-web.js');
const client = new Client();
const qrcode = require('qrcode-terminal');

async function run() {
  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('Conectado :3');
  });

  await client.initialize();

  client.on('message', async msg => {
    if (msg.body.match(/(hola|Hola|Buenos dias|buenos dias|buenas tardes|Buenas Tardes)/) && msg.from.endsWith('@c.us')) {
      const chat = await msg.getChat();
      chat.sendStateTyping();
      const hora = new Date().getHours();

      let saludo;
      if (hora >= 3 && hora < 12) {
        saludo = 'Buenos días';
      } else if (hora >= 12 && hora < 18) {
        saludo = 'Buenas tardes';
      } else {
        saludo = 'Buenas noches';
      }

      const textsaludo = `Te comunicaste con DM&DM\n${saludo}, por favor indícanos tu nombre`;
      await client.sendMessage(msg.from, textsaludo);

      const nombreusu = await EsperarMensaje(client, msg.from);

      if (nombreusu) {
        const nombre = nombreusu.body;
        chat.sendStateTyping();

        const registro = `Gracias ${nombre}, ¿qué proceso deseas realizar?\n1: Registrar cedula`;
        await client.sendMessage(msg.from, registro);

        const ResUsu = await EsperarMensaje(client, msg.from);

        if (ResUsu) {
          const opcion = ResUsu.body.toLowerCase();

          if (opcion === '1') {
            const regcedu = 'Indícanos por favor tu Cedula ';
            await client.sendMessage(msg.from, regcedu);
            const cedula = await EsperarMensaje(client, msg.from);
            
            const menu2 = 'Si deseas ver la informacion por favor digita 1';
            await client.sendMessage(msg.from, menu2);
            
            const menu3 = await EsperarMensaje(client, msg.from);

            if (menu3.body == '1') {
              const info = `La conversacion mantenida en este chat con el usuario: ${nombre} identificado con numero de Cedula: ${cedula.body} es totalmente confidencial`;
              await client.sendMessage(msg.from, info);
              const Despedida = `Muchas gracias por comunicarse con nosotros, esperamos haberle sido de ayuda`;
              await client.sendMessage(msg.from, Despedida);
            }
          }
        }
      }
    }
  });
}

function EsperarMensaje(client, user) {
  return new Promise(resolve => {
    const listener = async (msg) => {
      if (!msg.fromMe && msg.from === user) {
        client.removeListener('message', listener);
        resolve(msg);
      }
    };
    client.on('message', listener);
  });
}

run().catch(err => console.error(err));

