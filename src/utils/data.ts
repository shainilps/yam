export function isToolPresent(tools: Record<string, string>, tool: string) {
  return Object.values(tools).includes(tool);
}
