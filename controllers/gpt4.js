const { response, json } = require("express");
const OpenAI = require("openai");
var fs = require("fs");

const Card = require("../models/Card");

const openai = new OpenAI({
  apiKey: "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",
});

const generateTexttoHTML = async (card) => {
  cardTemp = JSON.parse(card);

  //RESUME TEXT
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "user",
        content:
          "haz un articulo de minimo 400 palabras, prepara una lista con los principales puntos y añade" +
          "titulos a los parragrafos, si el precio es 0 o 1 no lo comentes, añade tambien los enlaces web:" +
          card,
      },
    ],
  });

  var prompt = `
  puedes crear un JSON con el siguiente texto?
  ${chatCompletion.choices[0].message.content} `;

  const textToHTML = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  let htmlText = textToHTML.choices[0].message.content.replaceAll("\n", "");

  fs.writeFile(
    `bikeRoutes/${cardTemp.title.toLocaleLowerCase().replaceAll(" ", "")}.json`,
    htmlText,
    function (err) {
      if (err) throw err;
      console.log("Saved!");
    }
  );

  return cardTemp;
};

const resumeText = async (req, res = response) => {
  let cards = await Card.find().skip(25).limit(100);

  cards = cards.map((e) => {
    return JSON.stringify({
      title: e.titleCard,
      img: e.img,
      desnivel: e.info.Desnivel,
      distancia: e.info.Distancia,
      facebook: e.info.Facebook,
      instagram: e.info.Instagram,
      poblacion: e.info.Poblacion,
      provincia: e.info.Provincia,
      twitter: e.info.Twitter,
      web: e.info.Web,
      youtube: e.info.Youtube,
    });
  });

  for (const card of cards) {
    const data = await generateTexttoHTML(card);
    console.log(data);

    res.status(200).json({
      ok: "fin",
    });
  }

  res.status(200).json({
    ok: "fin",
  });
};

module.exports = {
  resumeText,
};
