import { createClient } from "redis";
import { executeC, executejs, executePy } from "./src/executeCodes";
import type { Job } from "./src/types/job";

const client = createClient();

client.connect().then(async () => {
  while (1) {
    const response = await client.rPop("problemStatement");

    if (!response) {
      await new Promise((r) => {
        setTimeout(r, 1000);
      });
      continue;
    }
    console.log("running");

    const parsedResponse = JSON.parse(response);

    const job: Job = {
      userId: parsedResponse.userId,
      language: parsedResponse.language,
      srcCode: parsedResponse.code,
      jobId: parsedResponse.jobId,
      stdIn: parsedResponse.stdIn,
    };

    if (job.language == "c") {
      console.log("c code runnint");
      await executeC(job);
    } else if (job.language == "py") {
      console.log("python running");
      await executePy(job);
    } else if (job.language == "js") {
      await executejs(job);
    }

    //update the db
  }
});
