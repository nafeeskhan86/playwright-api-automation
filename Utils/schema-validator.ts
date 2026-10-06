import fs from "fs/promises";
import path from "path";
import Ajv from "ajv";
import { createSchema } from "genson-js";

const SCEHMA_BASE_PATH = "./reponse-schemas";
const ajv = new Ajv({ allErrors: true });

export async function validateSchema(
  dirName: string,
  fileName: string,
  reponseBody: object,
  createSchemaFlag: boolean = false,
): Promise<void> {
  const schemaPath = path.join(
    SCEHMA_BASE_PATH,
    dirName,
    `${fileName}_schema.json`,
  );
  if (createSchemaFlag) {
    await generateNewSchema(reponseBody,schemaPath)   
  }
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

async function generateNewSchema(reponseBody: Object, schemaPath: string) {
  try {
    const generatedSchema = createSchema(reponseBody);
    await fs.mkdir(path.dirname(schemaPath), { recursive: true });
    await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create schema file: ${message}`);
  }
}
