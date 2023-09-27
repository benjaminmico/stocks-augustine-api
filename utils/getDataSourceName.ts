export const getDataSourceName = (str: string): string => {
  // Convert the first character of the string to uppercase and concatenate it with the rest of the string
  const pascalCaseStr = str.charAt(0).toUpperCase() + str.slice(1);

  // Append "LambdaDataSource" to the converted string
  return `${pascalCaseStr}LambdaDataSource`;
};
