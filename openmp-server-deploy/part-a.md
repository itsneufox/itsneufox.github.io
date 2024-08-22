---
layout: default
title: Part A - Connect, Update, and Create User
parent: open.mp Server Deploy
nav_order: 2
---

# Part A - Connect, Update, and Create User

## Step 1 - Open PuTTY or your hosting SSH solution and connect to your instance
{: .important }
*There are comprehensive guides on the web or even your hosting solution website on how to connect via PuTTY. Some SSH connections need a key, so I can't provide any help here, but feel free to ask on open.mp Discord or search the web!*

## Step 2 - Updating your Linux instance

Let's ensure that your system is up-to-date:

```bash
sudo apt update
sudo apt upgrade
```

## Step 3 - Create a new user

For security reasons, it's best practice to create a new user specifically for running the server:

{: .important }
*Change `MyUserName` to a username of your choice!*

```bash
sudo adduser MyUserName
```

*Optional*: After creating the user, add it to the sudo group:

```bash
sudo usermod -aG sudo MyUserName
```

## Step 4 - Give permission to the root user

We need to give the root user access to the folder so that when using Filezilla or WinSCP, you can write and read the files inside the user folder:

```bash
chmod 775 /home/MyUserName
```

[Previous: Introduction](./introduction.md) | [Next: Part B - Download and Install the Server Files](./part-b.md)
