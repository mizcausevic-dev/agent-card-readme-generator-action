export interface RunnerEnv {
    inputs: Record<string, string | undefined>;
    GITHUB_OUTPUT?: string;
    GITHUB_EVENT_NAME?: string;
    GITHUB_REPOSITORY?: string;
    GITHUB_EVENT_PATH?: string;
    /** Read a file. Defaults to fs.readFileSync. */
    readFile?: (path: string) => string;
    /** Write a file (creates dirs). Defaults to fs.writeFileSync + mkdirSync. */
    writeFile?: (path: string, content: string) => void;
    /** Predicate. Defaults to fs.existsSync. */
    exists?: (path: string) => boolean;
    /** Stubbed PR-comment poster. */
    postComment?: (args: {
        token: string;
        repo: string;
        issueNumber: number;
        body: string;
    }) => Promise<void>;
    /** Output stream. */
    write?: (line: string) => void;
}
export interface RunnerResult {
    exitCode: 0 | 1;
    markdown: string;
    outputWritten: boolean;
    commentPosted: boolean;
    reason?: string;
}
export declare function run(env: RunnerEnv): Promise<RunnerResult>;
