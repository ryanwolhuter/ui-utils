# UI-Utils

UI-Utils is a command-line interface (CLI) utility for generating boilerplate code for TypeScript React components and Storybook stories.

## Overview

The main script `index.ts` is a subcommands runner that accepts the `component` and `story` subcommands.

The `component` command is defined in `component.ts`, it generates a new React component based on user input.

The `story` command is defined in `story.ts`, it generates a Storybook story for a given React component.

## Usage

### Component Command

The component command generates a new React component.

```bash
ui-utils component [name] [options]
```

* `[name]`: The name of the component. Must be capitalized.

Options:

* `--styled-component` (`-s`): Use styled-components boilerplate.
* `--css-module` (`-m`): Use css-modules boilerplate.
* `--props` (`-p`): Add `Props` type to component.
* `--children` (`-c`): Add `Props` type with children key to component.
* `--components-dir-path` (`-d`): Path to components directory. Defaults to `src/components`.

Note: You cannot use both `styled-component` and `css-module` at the same time.

### Story Command

The story command generates a Storybook story for a given React component.

```bash
ui-utils story [name] [options]
```

* `[name]`: The name of the component. Must be capitalized.

Options:

* `--stories-dir-path` (`-p`): Path to stories directory. Defaults to `src/stories`.
* `--component-file-path` (`-c`): Path to component file. Defaults to `src/components/[name]`.

## Installation

As a CLI, you may want to install UI-Utils globally or as part of a project's devDependencies. 

Please check your package manager's documentation for the correct command to install a package globally or as a devDependency.

```bash
npm install -g ui-utils
# or
yarn global add ui-utils
```

## Contributing

Feel free to open issues or PRs if you find any problems or have suggestions for improvements or new features.

## License

This project is licensed under the terms of the ISC license.