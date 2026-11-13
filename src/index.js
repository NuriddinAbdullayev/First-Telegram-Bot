import sharp from "sharp";
import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Welcome to @Adjust_picture_bot! \n\nSend me your photo!")); // initial work for the first time

bot.on(message("photo"), async (ctx) => {
  const photo = ctx.message.photo;
  const largestPhoto = photo.at(-1);
  const photoId = largestPhoto.file_id;
  const fileUrl = await ctx.telegram.getFileLink(photoId);

  const response = await fetch(fileUrl);

  if(!response.ok) {
    throw new Error("Failed to download the image!")
  }

  const arrayBuffer = await response.arrayBuffer();
  const imageBuilder = Buffer.from(arrayBuffer);

  const resizedPhoto = await sharp(imageBuilder)
                              .resize({width: 1220, height: 2712, fit: "cover"})
                              .toBuffer()

  const sentPhoto = await ctx.replyWithPhoto({
    source: resizedPhoto,
    filename: "resizedPhoto.jpg"
  })
})


bot.launch();

console.log("Bot is running!");