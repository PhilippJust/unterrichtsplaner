# Setup Client-Side Next.js App with Isomorphic Core

## Objective
Configure the Next.js app to run entirely client-side, using `@unterrichtsplaner/core` for logic. The core package will be updated to be browser-compatible (isomorphic).

## Key Files
-   `packages/core/src/genAi/geminiClient.ts`: Update for browser support (remove `dotenv`, optional key).
-   `packages/core/src/output/docx.ts`: Return `Blob` instead of `Buffer`.
-   `packages/core/src/output/docx.local.test.ts`: Update tests for `Blob`.
-   `packages/userInterface/next-js/`: Client-side implementation.

## Implementation Steps

1.  **Update Root Workspace**:
    -   Add `"packages/userInterface/next-js"` to `workspaces` in root `package.json`.

2.  **Make Core Isomorphic**:
    -   **Update `packages/core/src/genAi/geminiClient.ts`**:
        -   Remove `dotenv` import.
        -   Constructor: Accept `options?: { apiKey?: string }`.
        -   If `apiKey` is provided, use it.
        -   If not, try `process.env.GEMINI_API_KEY` (safely checking if `process` exists).
        -   Export `Content` type (or ensure access to it).
    -   **Update `packages/core/src/output/docx.ts`**:
        -   Modify `unterrichtsAblaufToDocx` to return `Promise<Blob>`.
        -   Use `Packer.toBlob(doc)` instead of `toBuffer`.
    -   **Update Tests**:
        -   Modify `docx.local.test.ts` to handle `Blob` return from `unterrichtsAblaufToDocx` (convert to Buffer for writing to file).

3.  **Setup Next.js Project**:
    -   Add dependencies: `npm install @unterrichtsplaner/core jszip file-saver` (or `@types/file-saver`).
    -   Ensure `next.config.ts` handles the local package (transpilation might be needed if `core` is not pre-built, but usually Next.js handles workspaces).

4.  **Implement Client-Side Logic (`packages/userInterface/next-js/app/page.tsx`)**:
    -   **State**: `apiKey` (cookie), `lessonPlan`, `worksheet`.
    -   **Refs**: `geminiClient` (to hold chat state), `lessonPlanGenerator`, `worksheetGenerator`.
    -   **Components**:
        -   `ApiKeyModal`: Manages cookie.
        -   `LessonPlanForm`.
        -   `LessonPlanDisplay`.
        -   `WorksheetDisplay`.
    -   **Logic**:
        -   **Init**: On mount/key-change, init `GeminiClient` and Generators.
        -   **Generate Lesson Plan**: Call `lessonPlanGenerator.generiere(input)`. Update state.
        -   **Iterate**: Call `lessonPlanGenerator.iteriere(feedback)`. Update state.
        -   **Generate Worksheet**: Call `worksheetGenerator.generiere(undefined)`. (Context is preserved because `GeminiClient` instance is shared/reused or history passed? Wait, `Generator` takes `genAiClient` in constructor. If I reuse the *same* `GeminiClient` instance for both generators, they share the `chat` session?
        -   *Correction*: `GeminiClient` creates `this.chat` in constructor. If I reuse the instance, I reuse the chat.
        -   *However*: `UnterrichtsablaufGenerator` and `ArbeitsblattGenerator` might need to share the *same* `GeminiClient` instance to share context.
        -   *Yes*: Instantiate `GeminiClient` once. Pass it to both generators.
    -   **Download**:
        -   Call `unterrichtsAblaufToDocx` and `arbeitsblattToDocx`.
        -   Use `JSZip` to create a zip.
        -   Use `file-saver` (or `URL.createObjectURL`) to download.

5.  **I18n**:
    -   Hardcode German strings.

## Verification
-   Run `npm run test --workspaces` to ensure core tests pass.
-   Run Next.js app.
-   Test flow: Set Key -> Generate LP -> Generate WS -> Download.
-   Verify ZIP contains valid DOCX files.
