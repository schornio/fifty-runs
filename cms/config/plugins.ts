export default ({ env }) => ({
  upload: {
    config: {
      provider: "vercel-blob",
      providerOptions: {
        token: env("BLOB_READ_WRITE_TOKEN"),
      },
    },
  },
});
