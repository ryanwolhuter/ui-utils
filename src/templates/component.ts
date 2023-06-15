function wrapper({
  name,
  type,
  children,
}: {
  name: string;
  type: string;
  children: boolean;
  }) {
  const content = children ? "{children}" : name;
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
  children,
}: {
  name: string;
  type: "styled-component" | "css-module" | "none";
  children: boolean;
  }) {
  const childrenProps = children ? `type Props = {
  children: React.ReactNode;
}
` : ""
const childrenArgs = children ? `{ children }: Props`: ""
  const common = `${childrenProps}export function ${name}(${childrenArgs}) {
  return ${wrapper({ name, type, children })};
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
