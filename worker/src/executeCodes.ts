import type { Job } from "./types/job";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

export async function executeC(job: Job) {
  // code to execute c lang

  const jobDir = path.join(process.cwd(), "jobs", job.jobId);

  await fs.mkdir(jobDir, { recursive: true });

  await fs.writeFile(path.join(jobDir, "main.c"), job.srcCode);

  const docker = spawn("docker", [
    "run",
    "--rm",
    "-i",
    "--network",
    "none",
    "--mount",
    `type=bind,src=${jobDir},dst=/src`,
    "--workdir",
    "/src",
    "gcc:14",
    "sh",
    "-c",
    "gcc main.c -o main && ./main",
  ]);

  docker.stdout.on("data", (data) => {
    console.log(`stdout:\n${data}`);
  });
  docker.stderr.on("data", (data) => {
    console.log(`stderr : ${data}`);
  });
  docker.on("close", (code) => {
    console.log(`Process closed with code ${code}`);
  });

  await fs.rm(jobDir, {
    recursive: true,
    force: true,
  });
}

export async function executejs(job: Job) {
  // code to execute js lang

  const jobDir = path.join(process.cwd(), "jobs", job.jobId);

  await fs.mkdir(jobDir, { recursive: true });

  await fs.writeFile(path.join(jobDir, "main.js"), job.srcCode);

  const docker = spawn("docker", [
    "run",
    "--rm",
    "-i",
    "--network",
    "none",
    "--mount",
    `type=bind,src=${jobDir},dst=/src`,
    "--workdir",
    "/src",
    "node:22-alpine",
    "node",
    "main.js",
  ]);

  docker.stdout.on("data", (data) => {
    console.log(`stdOut : ${data}`);
  });
  docker.stderr.on("data", (data) => {
    console.log(`stdErr : ${data}`);
  });
  docker.on("close", (code) => {
    console.log(`"process exited with code" : ${code}`);
  });
  await fs.rm(jobDir, {
    recursive: true,
    force: true,
  });
}

export async function executePy(job: Job) {
  // code to execute Python lang
  const jobDir = path.join(process.cwd(), "jobs", job.jobId);

  await fs.mkdir(jobDir, { recursive: true });

  await fs.writeFile(path.join(jobDir, "main.py"), job.srcCode);

  const docker = spawn("docker", [
    "run",
    "--rm",
    "-i",
    "--network",
    "none",
    "--mount",
    `type=bind,src=${jobDir},dst=/src`,
    "--workdir",
    "/src",
    "python:3.12-slim",
    "python",
    "main.py",
  ]);

  docker.stdout.on("data", (data) => {
    console.log(`StdOut : ${data}`);
  });
  docker.stderr.on("data", (data) => {
    console.log(`StdIn : ${data}`);
  });
  docker.on("close", (code) => {
    console.log(`Process ended with code ${code}`);
  });
  await fs.rm(jobDir, {
    recursive: true,
    force: true,
  });
}

// executeC({
//   jobId: "1",
//   userId: "2",
//   language: "c",
//   srcCode: `#include <stdio.h>
//               int main() {
//                 // Print text to the screen
//                 printf("Hello, World!");

//                 // Indicate that the program ran successfully
//                 return 0;
//           }`,
// });

// executePy({
//   jobId: "1",
//   userId: "2",
//   language: "py",
//   srcCode: `print("Hello world")`,
// });
