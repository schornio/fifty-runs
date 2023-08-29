import type { Preview } from "@storybook/react";
import { Montserrat } from "next/font/google";
import "../app/globals.css";
import React from "react";

const montserrat = Montserrat({ subsets: ["latin"] });

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className={montserrat.className}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
