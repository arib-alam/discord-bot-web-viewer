import type {
  APIPartialGuild,
  APIUser,
  RESTAPIPartialCurrentUserGuild,
} from "discord-api-types/v10";

const Images = {
  Guild: {
    IconUrl: (guild: APIPartialGuild | RESTAPIPartialCurrentUserGuild) =>
      `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`,
  },

  User: {
    AvatarUrl: (user: APIUser) =>
      user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${Number(user.id) % 5}.png`,
  },
} as const;

export default Images;
