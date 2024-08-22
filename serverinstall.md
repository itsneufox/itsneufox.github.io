---
layout: default
title: open.mp Server Deploy
nav_order: 2
description: "Guide for installing an open.mp server on Debian-based Linux."
permalink: /installation/
---


# Easy open.mp Server Installation
#(All Debian based Linux)



{: .warning }
*If you are using the SA:MP server and didn't convert to open.mp yet, [please stop here and read this guide](https://github.com/adib-yg/openmp-server-installation)!*

{: .warning }
*If you are using the FCNPC plugin, please stop for now because this plugin does not work for open.mp currently.<br>
But not for long! [You can help with a donation here on the Open Collective!](https://opencollective.com/openmultiplayer)*

## Introduction

Welcome! This repository contains a comprehensive guide on installing an open.mp server on Ubuntu or another Debian-based Linux.<br>
Whether you're a beginner or just looking to refresh your knowledge, this guide should have something for you.

## Table of contents
{: .no_toc }

1. TOC
{:toc}

## Prerequisites

Before starting this guide, you should have:
- A machine running Ubuntu (20.04 or later recommended) or another Debian-based Linux;
- Filezilla or WinSCP for file transfers;
- PuTTY or your hosting SSH solution;

{: .important }
>*If you install WinSCP, the installer will prompt you to install PuTTY! It's up to you if you want to install it or not, but you can always download it later!*

## Part A - Connect, update, and create user

### Step 1 - Open PuTTY or your hosting SSH solution and connect to your instance
{: .important }
>*There are comprehensive guides on the web or even your hosting solution website on how to connect via PuTTY. Some SSH connections need a key, so I can't provide any help here, but feel free to ask on open.mp Discord or search the web!*

### Step 2 - Updating your Linux instance

Let's ensure that your system is up-to-date:

```bash
sudo apt update
sudo apt upgrade
```

### Step 3 - Create a new user

For security reasons, it's best practice to create a new user specifically for running the server:

{: .important }
>*Change `MyUserName` to a username of your choice!*

```bash
sudo adduser MyUserName
```

*Optional*: After creating the user, add it to the sudo group:

```bash
sudo usermod -aG sudo MyUserName
```

### Step 4 - Give permission to the root user

We need to give the root user access to the folder so that when using Filezilla or WinSCP, you can write and read the files inside the user folder:

```bash
chmod 775 /home/MyUserName
```

## Part B - Download and install the server files

### Step 5 - Download the server files

You can do this two ways, the **blind way** or the **noob-proof way**.

#### The blind way:

Use **wget** to download the files from the open.mp repository:

```bash
wget https://github.com/openmultiplayer/open.mp/releases/download/v1.2.0.2670/open.mp-linux-x86.tar.gz
```

{: .important }
>*In this guide, we are downloading the static version! Check the latest version marked with a green tag saying "Latest" [here](https://github.com/openmultiplayer/open.mp/releases), then right-click the intended file and copy the link!*

Extract the downloaded files:

```bash
tar -xzf open.mp-linux-x86.tar.gz
```

Navigate to the extracted directory:

```bash
cd Server
```

#### The noob-proof way:

- [Go here](https://github.com/openmultiplayer/open.mp/releases) and check the release marked with a green tag saying "Latest".
- Download the file called `open.mp-linux-x86.tar.gz`.
{: .warning }
>*In this guide, we are downloading the static version!*
- Use 7zip or your zip manager of choice and unzip the downloaded file.
- Open Filezilla or WinSCP and drop the folder `Server` inside the folder of the user you created in **Part A**.

## Part C - Finishing up and starting the server

### Step 6 - Install x86 files

{: .important }
>*If you used the noob-proof way, come back to PuTTY or your hosting SSH solution and navigate to your server folder using:*
```bash
cd Server
```

We have to update `apt`:

```bash
sudo apt update
```

Enable support for 32-bit packages since we are on a 64-bit system:

```bash
sudo dpkg --add-architecture i386
```

Now install the necessary packages:

```bash
sudo apt install libc6:i386
```

### Step 7 - Starting up the server

{: .important }
>*This is only needed once. After that, you can skip to starting up without using `chmod`!*

Make the `omp-server` executable:

```bash
chmod +x omp-server
```

Start the server:

```bash
nohup ./omp-server &
```

The terminal should then output something like this:

```
[1] MyNumberHere
MyUserName@ip-123-45-67-89:/home/MyUserName$ nohup: ignoring input and appending output to 'nohup.out'
```

Write down the number the terminal gave you and you can close the terminal!

{: .important }
*If you forgot to write down the number, you can retrieve it using the `top` command in Step 8.*

### Step 8 - Closing the server

If you wrote down the number in step 7, just do:

```bash
sudo kill MyNumberHere
```

{: .important }
>*Change `MyNumberHere` to the intended number!*

If you forgot to copy the number:

```bash
top
```

Wait a few seconds while the list updates and look for something like this at the top:

```
MyNumberHere | MyUserName | 00 | 0 | 00 | 00 | 00 | S | 0.0  | 0.0 | 0:00.00 | omp-server
```

Write it down or memorize it, press `Q` on your keyboard to exit, and then do:

```bash
sudo kill MyNumberHere
```

## Part D - Uploading your own gamemode and files

Visit [this guide](https://github.com/adib-yg/openmp-server-installation) to understand how to transfer your files from your server to your Linux instance.

{: .important }
>*Don't forget that Linux can't read `.dll` files, always download the `.so` counterparts!*

## Help

If you have issues with the server or this guide, [please join the official open.mp Discord server](https://discord.gg/samp) and use the [#openmp-support](https://discord.com/channels/231799104731217931/966398440051445790) channel.

## Final words

If you feel anything wrong with this guide, please feel free to ping me @itsneufox on [the official open.mp Discord server](https://discord.gg/samp) and let me know!

### Thanks to the open.mp team for their awesome work and their effort to keep this community alive!
