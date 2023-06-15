export function indexTemplate(name: string) {
  return `export * from "./${name}";\n`;
}
