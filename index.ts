import { component, story } from "@/commands";
import { run, subcommands } from "cmd-ts";

const app = subcommands({
  name: "ui-utils",
  description:
    "Creates boilerplate for TypeScript React components and Storybook stories.",
  cmds: { component, story },
});

run(app, process.argv.slice(2));
