---
layout: default
title: Download and Install the Server Files
parent: open.mp Server Deploy
nav_order: 3
---

# Download and Install the Server Files

In this part, you'll download and install the open.mp server files. There are two ways to do this: the **blind way** (using terminal commands) and the **noob-proof way** (using a graphical interface). Choose the method that best suits your comfort level.

## Step 5 - Download the Server Files

### Method 1: The Blind Way

If you're comfortable with terminal commands, follow these steps to download and extract the server files directly from the open.mp repository.

1. Use `wget` to download the server files: 
   ```bash
   wget https://github.com/openmultiplayer/open.mp/releases/download/v1.2.0.2670/open.mp-linux-x86.tar.gz
   ```

   {: .important }
   > **Note:** In this guide, we are downloading the static version. Be sure to check the [latest release](https://github.com/openmultiplayer/open.mp/releases) and right-click the intended file to copy the link.

2. Extract the downloaded files:
   ```bash
   tar -xzf open.mp-linux-x86.tar.gz
   ```

3. Navigate to the extracted directory:
   ```bash
   cd Server
   ```

### Method 2: The Noob-Proof Way

If you prefer using a graphical interface to download and extract the files, follow these steps:

1. Go to the [open.mp releases page](https://github.com/openmultiplayer/open.mp/releases) and look for the release marked with a green "Latest" tag.
2. Download the file named `open.mp-linux-x86.tar.gz`.
   {: .warning }
   > **Note:** We are downloading the static version in this guide. Make sure you select the correct file.

3. Use 7zip or your preferred archive manager to unzip the downloaded file.
4. Open **Filezilla** or **WinSCP** and upload the `Server` folder to the user directory you created in [**Connect, Update, and Create User**](/openmp-server-deploy/part-a).

{: .highlight } 
> **Tip:** The noob-proof method might take a bit longer because you need to upload the files to the host.


[Previous: Connect, Update, and Create User](/openmp-server-deploy/part-a){: .btn .btn-blue .mr-4 }
[Next: Part C - Finishing Up and Starting the Server](/openmp-server-deploy/part-c){: .btn .btn-blue .mr-4 }

