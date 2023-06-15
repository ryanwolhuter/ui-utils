function wrapper({
  name,
  type,
  props,
  children,
}: {
  name: string;
  type: string;
  props: boolean;
  children: boolean;
}) {
  const content = children ? "{children}" : props ? "{example}" : name;
  if (type === "styled-component") {
    return `<Wrapper>${content}</Wrapper>`;
  }
  if (type === "css-module") {
    return `<div className={styles.${name}}>${content}</div>`;
  }
  return `<div>${content}</div>`;
}

export function componentTemplate({
  name,
  type,
  props,
  children,
}: {
  name: string;
  type: "styled-component" | "css-module" | "none";
  props: boolean;
  children: boolean;
}) {
  const propsTypeWithExample = props
    ? `type Props = {
  example: string;
}
`
    : "";
  const propsTypeWithChildren = children
    ? `type Props = {
  children: React.ReactNode;
}
`
    : "";
  const propsType = children ? propsTypeWithChildren : propsTypeWithExample;
  const propsArgWithExample = props ? `{ example }: Props` : "";
  const propsArgWithChildren = children ? `{ children }: Props` : "";
  const propsArg = children ? propsArgWithChildren : propsArgWithExample;
  const common = `${propsType}export function ${name}(${propsArg}) {
  return ${wrapper({ name, type, props, children })};
}
`;
  if (type === "styled-component") {
    return `import styled from "styled-components";

${common}
const Wrapper = styled.div\`
  color: black;
\`;
`;
  }

  if (type === "css-module") {
    return `import styles from "./${name}.module.css";

${common}
`;
  }

  return common;
}
