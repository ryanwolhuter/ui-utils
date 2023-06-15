export function exportTemplate(name: string) {
  return `export * from "./${name}";\n`;
}
