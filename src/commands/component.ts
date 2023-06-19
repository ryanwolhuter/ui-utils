import { defaultComponentsDirPath } from "@/constants";
import { componentTemplate, exportTemplate, styleTemplate } from "@/templates";
import { handleError, logSuccess, makeComponentFilePaths } from "@/utils";
import { write } from "bun";
import { command, flag, option, optional, positional, string } from "cmd-ts";
import { appendFileSync, existsSync, mkdirSync } from "fs";

export const component = command({
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
    props: flag({
      long: "props",
      short: "p",
      description: "Add `Props` type to component",
    }),
    children: flag({
      long: "children",
      short: "c",
      description: "Add `Props` type with children key to component",
    }),
    componentsDirPath: option({
      type: optional(string),
      long: "components-dir-path",
      short: "d",
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
    props,
    children,
    componentsDirPath = defaultComponentsDirPath,
  }) => {
    if (name[0].toUpperCase() !== name[0]) {
      handleError("Name of React component must be capitalized");
    }

    if (styledComponent && cssModule) {
      handleError("Cannot use both styled-component and css-module");
    }

    if (props && children) {
      handleError(
        "Specifying `children` overrides `props` — they both add a `Props` type to the component, but `children` adds a `children` key to the `Props` type"
      );
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
    const componentCode = componentTemplate({ name, type, props, children });
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
