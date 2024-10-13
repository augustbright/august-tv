import { MethodDeclaration, Project, Type } from "ts-morph";
import meow from "meow";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import * as ts from "typescript";
import { format } from "prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cli = meow(
    `
    Usage
        $ generate <input>

    Options
        --project, -p  path to tsconfig.json
        --output, -o  path to output file  

    Examples
        $ generate ./apps/backend -o ./packages/dto/generated.ts
`,
    {
        importMeta: import.meta,
        flags: {
            project: {
                type: "string",
                shortFlag: "p",
                isRequired: false,
            },
            output: {
                type: "string",
                shortFlag: "o",
                isRequired: true,
            },
        },
    }
);

process.chdir(path.resolve(__dirname, cli.input[0]));
console.log("Working in:", process.cwd());

const outputPath = "../../packages/dto/generated.ts";

// Run the generator function and write to a single file
await generateDtoFile(path.resolve(outputPath));

async function generateDtoFile(outputPath: string) {
    console.log(`Using tsconfig: ${path.resolve("./tsconfig.json")}`);
    const project = new Project({
        tsConfigFilePath: "./tsconfig.json", // Update path to your tsconfig.json
        libFolderPath: "../../node_modules/typescript/lib",
    });

    const sourceFiles = project.addSourceFilesAtPaths("**/*.controller.ts");

    let dtoContent = `import PrismaClient from '@prisma/client';\n\n`;
    dtoContent += `import { DecodedIdToken } from "firebase-admin/auth";\n\n`;
    dtoContent += `export type DTO = {\n`;

    // Iterate through all source files, classes, and methods
    sourceFiles.forEach((sourceFile) => {
        sourceFile.getClasses().forEach((cls) => {
            const className = cls.getName();
            if (!className) return; // Skip unnamed classes (rare case)

            // Start generating the controller structure
            dtoContent += `  ${className.replace("Controller", "").toLowerCase()}: {\n`;

            cls.getMethods().forEach((method) => {
                const methodName = method.getName();
                const responseDto = getDtoForMethod(method);

                // Add the method response type to the structure
                dtoContent += `    ${methodName}: {\n`;
                dtoContent += `      response: ${responseDto};\n`;
                dtoContent += `    },\n`;
            });

            // Close the controller structure
            dtoContent += `  },\n`;
        });
    });

    // Close the overall DTO structure
    dtoContent += `};\n`;

    dtoContent = dtoContent.replace(
        /import\(.*\).DecodedIdToken/,
        "DecodedIdToken"
    );

    // const formatted = await format(dtoContent, {
    //     parser: "typescript",
    //     tabWidth: 4,
    // });
    const formatted = dtoContent;

    // Write the generated DTO to the output file
    await fs.writeFile(outputPath, formatted, "utf-8");
}

// Function to generate the DTO structure from a method's return type
function getDtoForMethod(method: MethodDeclaration): string {
    const returnType = method.getReturnType().getText();
    const cleanedType = cleanUpReturnType(returnType);
    return cleanedType;
}

// Helper to clean up Prisma imports and strip Promise wrappers
function cleanUpReturnType(typeText: string): string {
    // Strip out `Promise<>` and handle Prisma imports
    const withoutPromise = typeText.replace(/^Promise<(.+)>$/, "$1");
    return withoutPromise.replace(
        /import\(".*?node_modules\/\.prisma\/client\/index"\)\.(\$Enums\.[A-Za-z]+)/g,
        "PrismaClient.$1"
    );
}

export async function ensureDir(dir: string): Promise<string> {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
    return dir;
}
