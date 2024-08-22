---
layout: default
title: Part B - Download and Install the Server Files
parent: open.mp Server Deploy
nav_order: 3
---

# Part B - Download and Install the Server Files

## Step 5 - Download the server files

You can do this two ways, the **blind way** or the **noob-proof way**.

### The blind way:

Use **wget** to download the files from the open.mp repository:

```bash
wget https://github.com/openmultiplayer/open.mp/releases/download/v1.2.0.2670/open.mp-linux-x86.tar.gz
```

{: .important }
*In this guide, we are downloading the static version! Check the latest version marked with a green tag saying "Latest" [here](https://github.com/openmultiplayer/open.mp/releases), then right-click the intended file and copy the link!*

Extract the downloaded files:

```bash
tar -xzf open.mp-linux-x86.tar.gz
```

Navigate to the extracted directory:

```bash
cd Server
```

### The noob-proof way:

- [Go here](https://github.com/openmultiplayer/open.mp/releases) and check the release marked with a green tag saying "Latest".
- Download the file called `open.mp-linux-x86.tar.gz`.
{: .warning }
*In this guide, we are downloading the static version!*
- Use 7zip or your zip manager of choice and unzip the downloaded file.
- Open Filezilla or WinSCP and drop the folder `Server` inside the folder of the user you created in **Part A**.

[Previous: Part A - Connect, Update, and Create User](./part-a.md) | [Next: Part C - Finishing Up and Starting the Server](./part-c.md)
