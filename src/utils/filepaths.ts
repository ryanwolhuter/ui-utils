export function makeComponentFilePaths(componentsDirPath: string, name: string) {
  const componentDirPath = `${componentsDirPath}/${name}`;
  const indexPath = `${componentDirPath}/index.ts`;
  const componentsIndexPath = `${componentsDirPath}/index.ts`;
  const componentPath = `${componentDirPath}/${name}.tsx`;
  const stylePath = `${componentDirPath}/${name}.module.css`;

  return {
    componentDirPath,
    indexPath,
    componentsIndexPath,
    componentPath,
    stylePath,
  };
}
