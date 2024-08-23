---
layout: default
title: Connect, Update, and Create User
parent: open.mp Server Deploy
nav_order: 2
---

# Connect, Update, and Create User

In this part, you'll learn how to connect to your server, update your Linux instance, and create a new user account for running the server securely.

## Step 1 - Connect to Your Server

To start, connect to your server using PuTTY or any SSH client supported by your hosting provider.

{: .note-title }
>
> **Need help connecting?**  
> Check your hosting provider's documentation or search for guides on connecting via SSH using PuTTY or similar clients.  
> **Note:** Some SSH connections may require a key file.

## Step 2 - Update Your Linux Instance

Before setting up the server, ensure your Linux instance is up-to-date with the latest packages and security patches. Run the following commands:

```bash
sudo apt update
sudo apt upgrade
```

{: .important }
> **Why update?**  
> Updating your system ensures that you have the latest security patches and software updates, which are crucial for keeping your server secure.

## Step 3 - Create a New User

For security reasons, it's best practice to avoid running your server as the root user. Instead, create a new user dedicated to running the server.

1. Create a new user:
    ```bash
    sudo adduser MyUserName
    ```
    {: .note }
    > **Tip:** Replace `MyUserName` with a username of your choice. 

2. *Optional:* Grant the new user `sudo` privileges so they can perform administrative tasks if needed:
    ```bash
    sudo usermod -aG sudo MyUserName
    ```
    {: .note }
    > Granting sudo access is optional, but it can be useful if the new user needs to perform system-level tasks in the future.

## Step 4 - Adjust Permissions for the New User

To enable file transfers via Filezilla or WinSCP, you need to grant the root user permission to access the new user's home directory:

```bash
chmod 775 /home/MyUserName
```

{: .highlight } 
> **Explanation:**  
> This command ensures that both the root user and your new user can read, write, and execute files in the specified directory. This is important for managing server files using Filezilla or WinSCP.


[Previous](/openmp-server-deploy/introduction){: .btn .btn-blue .float-left .mb-lg-4}
[Next](/openmp-server-deploy/part-b){: .btn .btn-blue .float-right}

