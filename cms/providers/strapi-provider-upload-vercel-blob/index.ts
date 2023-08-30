import { del, put } from "@vercel/blob";

export const init = ({ token }) => {
  return {
    async upload(file) {
      const result = await put(file.name, file.buffer, {
        access: "public",
        token,
      });
      file.url = result.url;
    },

    async uploadStream(file) {
      const result = await put(file.name, file.stream, {
        access: "public",
        token,
      });
      file.url = result.url;
    },

    async delete(file) {
      del(file.url, { token });
    },
  };
};
