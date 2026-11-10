export interface Job {
  jobId: string;
  userId: string;
  language: "c" | "js" | "py";
  srcCode: string;
  stdIn?: string;
}
