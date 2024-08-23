---
layout: default
title: Finishing Up and Starting the Server
parent: open.mp Server Deploy
nav_order: 4
---

# Part C - Finishing Up and Starting the Server

In this part, you'll complete the installation by enabling 32-bit package support, making the server executable, and starting it up.

## Step 6 - Install x86 Libraries

If you're running a 64-bit system, you'll need to install support for 32-bit libraries to ensure the server runs properly.

1. Update your package list:
    ```bash
    sudo apt update
    ```

2. Enable support for 32-bit architecture: 
    ```bash
    sudo dpkg --add-architecture i386
    ```

3. Install the required 32-bit libraries:
    ```bash
    sudo apt install libc6:i386
    ```

{: .important }
> **If you used the noob-proof method**:  
> Remember to reconnect to your server using PuTTY or your SSH solution, and navigate to your server folder:
> ```bash
> cd Server
> ```

## Step 7 - Start the Server

Now it's time to start your open.mp server for the first time.

1. Make the `omp-server` file executable (this is only needed once):
    ```bash
    chmod +x omp-server
    ```

2. Start the server:
    ```bash
    nohup ./omp-server &
    ```

3. The terminal should output something like this:
    ```
    [1] MyNumberHere 
    MyUserName@ip-123-45-67-89:/home/MyUserName$ nohup: ignoring input and appending output to 'nohup.out'
    ```

4. Write down the number the terminal gave you (this is the process ID), and you can safely close the terminal.

{: .note }
> **Why the process ID matters**:  
> The process ID (PID) is essential if you need to stop the server later. If you forget to write it down, don’t worry! We’ll cover how to find it in the next step.

## Step 8 - Stopping the Server

If you need to stop the server, you'll use the PID that was given to you when you started the server.

1. If you wrote down the PID, use the following command to stop the server:
    ```bash
    sudo kill MyNumberHere
    ```
    {: .important }
    > **Replace `MyNumberHere` with the actual PID.**

2. If you forgot to write down the PID, you can find it using the `top` command:
    ```bash
    top
    ```

3. After running `top`, wait for a few seconds for the list to populate. Look for something like this at the top:
    ```
    MyNumberHere | MyUserName | 00 | 0 | 00 | 00 | 00 | S | 0.0  | 0.0 | 0:00.00 | omp-server
    ```

4. Write down or memorize the PID, then press `Q` to exit the `top` view.

5. Once you have the PID, stop the server:
    ```bash
    sudo kill MyNumberHere
    ```

{: .highlight }
> **Tip**: You only need to use `chmod +x` once to make the server executable. After that, you can start it directly with `nohup ./omp-server &`.

[Previous: Download and Install the Server Files](/openmp-server-deploy/part-b) | [Next: Part D - Uploading Your Own Gamemode and Files](/openmp-server-deploy/part-d)
