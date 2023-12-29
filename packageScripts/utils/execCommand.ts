import { exec } from "child_process";
export const execCommand = (command: string) =>
  new Promise<string>((resolve, reject) =>
    exec(command, (error, stdout, stderr) => {
      try {
        if (error) {
          console.error(error);
          console.log(stdout);
          console.error(stderr);
          reject(error);
          return;
        }
        resolve(stdout);
        console.log(stdout);
        console.error(stderr);
      } catch (err) {
        console.error(err);
      }
    })
  );
