export function storyTemplate({
  name,
  componentFilePath,
}: {
  name: string;
  componentFilePath: string;
}) {
  return `import { ${name} } from "${componentFilePath}";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  component: ${name},
};

export default meta;

type Story = StoryObj<typeof ${name}>;

const Template: Story = {};

export const Default: Story = {
  ...Template,
};
`;
}
