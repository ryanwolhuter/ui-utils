import { defaultStoriesDirPath } from "@/constants";
import { storyTemplate } from "@/templates";
import { handleError, logSuccess } from "@/utils";
import { write } from "bun";
import { command, option, optional, positional, string } from "cmd-ts";
import { existsSync } from "fs";

export const story = command({
  name: "story",
  args: {
    name: positional({
      type: string,
      displayName: "Name of the component to create a story for",
    }),
    storiesDirPath: option({
      type: optional(string),
      long: "stories-dir-path",
      short: "p",
      description: "Path to stories directory, defaults to `src/stories`",
    }),
    componentFilePath: option({
      type: optional(string),
      long: "component-file-path",
      short: "c",
      description:
        "Path to component file, defaults to `src/components/[name]`",
    }),
  },
  handler: ({
    name,
    storiesDirPath = defaultStoriesDirPath,
    componentFilePath = `src/components/${name}`,
  }) => {
    if (name[0].toUpperCase() !== name[0]) {
      handleError("Name of Story component must be capitalized");
    }
    if (
      storiesDirPath === defaultStoriesDirPath &&
      !existsSync(storiesDirPath)
    ) {
      handleError(
        "Using the default stories directory path `src/stories` but that path does not exist. Please create the directory or specify a different path with the `--stories-dir-path` flag."
      );
    }
    if (!existsSync(storiesDirPath)) {
      handleError(
        `The path you specified \`${storiesDirPath}\` does not exist. Please create the directory or specify a different path with the \`--stories-dir-path\` flag.`
      );
    }

    if (
      componentFilePath === `src/components/${name}` &&
      !existsSync(componentFilePath)
    ) {
      handleError(
        "Using the default component file path `src/components/[name]` but that path does not exist. Please create the directory or specify a different path with the `--component-file-path` flag."
      );
    }

    if (!existsSync(componentFilePath)) {
      handleError(
        `The path you specified \`${componentFilePath}\` does not exist. Please create the directory or specify a different path with the \`--component-file-path\` flag.`
      );
    }

    const storyCode = storyTemplate({
      name,
      componentFilePath,
    });

    const writePath = `${storiesDirPath}/${name}.stories.tsx`;

    try {
      write(writePath, storyCode);
      logSuccess(`Created story file for ${name}`);
      logSuccess(`Story path: ${writePath}`);
    } catch (e) {
      handleError(
        `Something went wrong when creating story file: ${
          e instanceof Error ? e.message : "Unknown error"
        }`
      );
    }
  },
});
