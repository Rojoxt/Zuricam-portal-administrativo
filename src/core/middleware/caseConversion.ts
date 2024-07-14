export function convertToSnakeCase(data: any) {
  let result: { [key: string]: any } = {};
  for (let key in data) {
    let snakeCaseKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    result[snakeCaseKey] = data[key];
  }
  return result;
}

export function convertToCamelCase(data: any) {
  let result: { [key: string]: any } = {};
  for (let key in data) {
    let camelCaseKey = key.replace(/(_\w)/g, matches => matches[1].toUpperCase());
    result[camelCaseKey] = data[key];
  }
  return result;
}
