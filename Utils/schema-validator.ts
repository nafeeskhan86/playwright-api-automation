import fs from "fs/promises";
import path from "path";
import Ajv from "ajv";

const SCEHMA_BASE_PATH = "./reponse-schemas";
const ajv = new Ajv({ allErrors: true });

export async function validateSchema(
  dirName: string,
  fileName: string,
  reponseBody: object,
): Promise<void> {
  const schemaPath = path.join(
    SCEHMA_BASE_PATH,
    dirName,
    `${fileName}_schema.json`,
  );
  const schema = await loadSchema(schemaPath);
  const validate = ajv.compile(schema);
  const valid = validate(reponseBody);
  if (!valid) {
    throw new Error(
      `Schema validation ${fileName}_schema.json failed:\n` +
        `${JSON.stringify(validate.errors, null, 4)}\n\n` +
        `Actual response body: \n` +
        `${JSON.stringify(reponseBody, null, 4)}`,
    );
  }
}

async function loadSchema(schemaPath: string): Promise<any> {
  try {
    const schemaContent = await fs.readFile(schemaPath, "utf-8");
    return JSON.parse(schemaContent);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load schema from ${schemaPath}: ${message}`);
  }
}
