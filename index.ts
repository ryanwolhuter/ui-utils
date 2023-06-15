import {
  componentTemplate,
  exportTemplate,
  storyTemplate,
  styleTemplate,
} from "@/templates";
import { handleError, logSuccess } from "@/utils";
import { makeComponentFilePaths } from "@/utils/filepaths";
import { write } from "bun";
import {
  command,
  flag,
  option,
  optional,
  positional,
  run,
  string,
  subcommands,
} from "cmd-ts";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";

const defaultComponentsDirPath = "src/components";
const defaultStoriesDirPath = "src/stories";

const component = command({
  name: "component",
  args: {
    styledComponent: flag({
      long: "styled-component",
      short: "s",
      description: "Use styled-components boilerplate",
    }),
    cssModule: flag({
      long: "css-module",
      short: "m",
      description: "Use css-modules boilerplate",
    }),
    children: flag({
      long: "children",
      short: "c",
      description: "Add children prop to component",
    }),
    componentsDirPath: option({
      type: optional(string),
      long: "components-dir-path",
      short: "p",
      description: "Path to components directory, defaults to `src/components`",
    }),
    name: positional({
      type: string,
      displayName: "name",
      description: "Name of the component",
    }),
  },
  handler: ({
    name,
    styledComponent,
    cssModule,
    children,
    componentsDirPath = defaultComponentsDirPath,
  }) => {
    if (name[0].toUpperCase() !== name[0]) {
      handleError("Name of React component must be capitalized");
    }
    if (styledComponent && cssModule) {
      handleError("Cannot use both styled-component and css-module");
    }

    if (
      componentsDirPath === defaultComponentsDirPath &&
      !existsSync(componentsDirPath)
    ) {
      handleError(
        "Using the default components directory path `src/components` but that path does not exist. Please create the directory or specify a different path with the `--components-dir-path` flag."
      );
    }

    if (!existsSync(componentsDirPath)) {
      handleError(
        `The path you specified \`${componentsDirPath}\` does not exist. Please create the directory or specify a different path with the \`--components-dir-path\` flag.`
      );
    }

    const type = styledComponent
      ? "styled-component"
      : cssModule
      ? "css-module"
      : "none";

    const {
      componentDirPath,
      indexPath,
      componentsIndexPath,
      componentPath,
      stylePath,
    } = makeComponentFilePaths(componentsDirPath, name);

    const exportCode = exportTemplate(name);
    const componentCode = componentTemplate({ name, type, children });
    const styleCode = cssModule ? styleTemplate : undefined;

    try {
      mkdirSync(componentDirPath);
      write(componentPath, componentCode);
      write(indexPath, exportCode);
      appendFileSync(componentsIndexPath, exportCode);

      if (styleCode) {
        write(stylePath, styleCode);
      }

      logSuccess(`Created component files for ${name}\n`);
      logSuccess(`Component path: ${componentPath}`);
      logSuccess(`Index path: ${indexPath}`);
      if (styleCode) {
        logSuccess(`Style path: ${stylePath}`);
      }
      logSuccess(
        `Added an export to your components directory: ${componentsIndexPath}`
      );
    } catch (e) {
      handleError(
        `Something went wrong while creating the component files: ${
          e instanceof Error ? e.message : e
        }`
      );
    }
  },
});

const story = command({
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

const app = subcommands({
  name: "ui-utils",
  cmds: { component, story },
});

run(app, process.argv.slice(2));
