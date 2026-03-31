export const azureDevOpsCourse = {
  id: 'azure-devops',
  title: 'Azure DevOps',
  description: 'Complete beginner guide — from Azure fundamentals to CI/CD pipelines, infrastructure as code, and Docker.',
  officialDocs: 'https://learn.microsoft.com/en-us/azure/devops/',
  tutorialLink: 'https://learn.microsoft.com/en-us/azure/devops/get-started/',
  exerciseLink: 'https://learn.microsoft.com/en-us/training/paths/evolve-your-devops-practices/',
  sections: [

    /* ───────────────────── 1. Introduction to Azure ─────────────────── */
    {
      title: 'Introduction to Azure',
      image: '/images/azure-devops/suite-overview.svg',
      content:
`**Microsoft Azure** is one of the world's leading *cloud computing platforms*. It allows individuals and organizations to **create and deploy software without owning physical servers**, enabling significant **cost optimization** and **scalability**.

### Why Cloud Computing?

Traditionally, companies had to buy and maintain their own servers, storage devices, and networking equipment. This approach — called **on-premises** — requires a large upfront investment, a dedicated IT team, and ongoing maintenance costs. Cloud computing removes these burdens by letting you rent computing resources on demand and pay only for what you use.

### What is Azure?

Azure is Microsoft's public cloud platform. It provides a wide range of services including **virtual machines, databases, storage, networking, AI, DevOps tools**, and much more. Azure operates across **60+ regions worldwide**, making it possible to deploy applications close to your users for low latency and high availability.

### Key Benefits of Azure

**Pay-as-you-go pricing** — You are billed only for the resources you consume, similar to a utility bill. **Global reach** — Deploy your applications in data centers around the world. **Scalability** — Scale your resources up or down instantly based on demand. **Security** — Microsoft invests over *$1 billion annually* in cybersecurity research and development. **Integration** — Seamlessly works with tools like *Visual Studio, GitHub, Azure DevOps*, and the *.NET ecosystem*.

Azure is especially popular among enterprises that already use Microsoft products, but it supports all major programming languages and frameworks including *Java, Python, Node.js, PHP*, and more.`,
      keyPoints: [
        'Azure is a cloud platform for building, deploying, and managing applications without physical servers.',
        'It offers pay-as-you-go pricing, eliminating the need for large upfront hardware investments.',
        'Azure operates across 60+ regions worldwide for global deployment.',
        'It supports all major languages and integrates deeply with Microsoft tools like Visual Studio and GitHub.'
      ]
    },

    /* ───────────────── 2. Azure Account, Tenant & Subscription ──────── */
    {
      title: 'Azure Account, Tenant & Subscription',
      image: '/images/azure-devops/azure-account-hierarchy.svg',
      content:
`Before you can use any Azure service, you need to understand three foundational concepts: **Account**, **Tenant**, and **Subscription**. Think of these as the organizational building blocks of Azure.

### Azure Account

An Azure account is created using an **email address** (Microsoft account or work/school account). This is your identity for signing in to the [Azure Portal](https://portal.azure.com). One person can have multiple Azure accounts if needed.

### Tenant (Directory)

A **Tenant** represents a dedicated instance of **Azure Active Directory (Azure AD)**. Every Azure account is associated with at least one tenant. Each tenant has a unique **Directory ID**. The tenant is where your organization's users, groups, and application registrations live. Think of the tenant as the *security boundary* for your organization.

### Subscription

A **Subscription** is tied to **billing**. It is the container where Azure tracks resource usage and sends invoices. You can create **multiple subscriptions** under the same account — for example, one for *development*, one for *testing*, and one for *production*. Each subscription has its own billing details and resource limits.

### Analogy to Understand the Hierarchy

**Azure Account** — *Think of it as a building.* **Subscription** — *A flat (apartment) in the building.* **Resource Group** — *A room in the flat.* **Resource** — *Furniture inside the room.*

This hierarchy allows organizations to organize, secure, and control costs across different teams and projects.`,
      keyPoints: [
        'An Azure Account requires an email address and is your identity for accessing Azure services.',
        'A Tenant is a dedicated Azure AD instance with a unique Directory ID — the security boundary.',
        'A Subscription handles billing and can be created per environment (dev, test, prod).',
        'Multiple subscriptions under one account help separate costs and manage resource limits.'
      ]
    },

    /* ──────────────── 3. Azure Resources & Resource Groups ──────────── */
    {
      title: 'Azure Resources & Resource Groups',
      content:
`Everything you create in Azure — a virtual machine, a database, a storage account, a web app — is called a **Resource**. Resources are the fundamental building blocks of your Azure infrastructure.

### What is a Resource Group?

A **Resource Group** is a logical container that holds related Azure resources. Before you can create any resource, you must first create a resource group to place it in. Resource groups help you **organize, manage, and control access** to resources as a single unit.

### Key Rules for Resource Groups

Every resource must belong to **exactly one** resource group. A resource group can contain resources from **different Azure regions**. You can **move resources** between resource groups. When you **delete a resource group**, all resources inside it are also deleted — so be careful!

### How to Create a Resource Group

You can create resource groups through the **Azure Portal**, **Azure CLI**, **PowerShell**, or **ARM templates**. In the Azure Portal, navigate to *Resource Groups* → click *Create* → provide a **name** and **region** → click *Review + Create*.

### Creating a Resource — Storage Account Example

A **Storage Account** is one of the most common Azure resources. It is used to store **Tables, Queues, and Containers** (which hold blobs or files). To create one: go to the Azure Portal → search for *Storage Account* → click *Create* → select your resource group → provide a unique name → choose your region and settings → click *Create*.

### Best Practice

Use a **consistent naming convention** for your resource groups and resources. For example: \`rg-projectname-environment\` such as \`rg-webapp-dev\` or \`rg-webapp-prod\`. This makes it easy to identify resources at a glance.`,
      keyPoints: [
        'Any service you create in Azure is called a Resource (VMs, databases, storage, web apps, etc.).',
        'A Resource Group is a mandatory logical container — you must create one before adding resources.',
        'Deleting a resource group deletes ALL resources inside it.',
        'Use consistent naming conventions like rg-projectname-environment for easy identification.'
      ]
    },

    /* ──────────────── 4. Storage Accounts & Access Tiers ──────────── */
    {
      title: 'Storage Accounts & Access Tiers',
      image: '/images/azure-devops/access-tiers.svg',
      content:
`Azure Storage Accounts are used primarily to store **unstructured data** — files like images, videos, documents, backups, and logs. Understanding how data is categorized and priced is essential for cost management.

### Types of Data

**Structured data** — Organized in tables with rows and columns, like SQL databases. **Semi-structured data** — Flexible format like *JSON* or *XML*. **Unstructured data** — Files such as images, videos, PDFs, and binary files.

### Storage Account Structure

The hierarchy is: **Storage Account** → **Containers** → **Blobs**. A *blob* (Binary Large Object) is any file stored in Azure Blob Storage. Containers are like folders that organize your blobs.

### Pricing Factors

Azure storage costs depend on two main factors: **the amount of storage used** (how much data you store) and **the number of transactions** (how often you read/write the data). Choosing the right access tier can significantly reduce costs.

### Access Tiers

**Hot Access Tier** — Best for *frequently accessed data*. It has the **lowest transaction costs** but **higher storage costs**. Use this for active application data, website assets, and files accessed daily.

**Cool Access Tier** — Best for *infrequently accessed data* (stored for at least 30 days). It has **lower storage costs** but **higher transaction costs** compared to Hot. Use this for backups, older logs, and monthly reports.

**Archive Access Tier** — Best for *rarely accessed data* (stored for at least 180 days). It offers the **lowest storage costs** but the **highest transaction costs**. Data must be **rehydrated** (moved back to an online tier) before it can be accessed, which takes time.

### Choosing the Right Tier

Think of it like a streaming subscription: if you watch movies every day, you pick a plan with unlimited streaming (Hot). If you watch occasionally, a cheaper plan works (Cool). If you rarely watch, you pick the cheapest archive option.

### Important Notes

Access tiers can only be set at the **blob level**, not the container level. You can change a blob's tier at any time through the Azure Portal or CLI.`,
      keyPoints: [
        'Storage Account hierarchy: Account → Containers → Blobs (Binary Large Objects).',
        'Hot tier: low transaction cost, high storage cost — for frequently accessed data.',
        'Cool tier: lower storage cost, higher transaction cost — for data accessed less than monthly.',
        'Archive tier: cheapest storage but requires rehydration to access — for long-term compliance data.'
      ]
    },

    /* ──────────────── 5. Life Cycle Management & Data Protection ───── */
    {
      title: 'Life Cycle Management & Data Protection',
      content:
`Managing data across access tiers manually can become tedious. Azure provides **Lifecycle Management Policies** to automate these transitions based on rules you define.

### Rehydration Process

When data is in the **Archive tier**, it cannot be accessed directly. You must first **rehydrate** it — move it back to either the *Hot* or *Cool* tier. Rehydration can take several hours depending on the priority you choose (*Standard* or *High*).

### Lifecycle Management Policies

Lifecycle management lets you **automatically transition blobs** between access tiers based on conditions like file age or last modification date. For example, you could create a rule that moves files from *Hot* to *Cool* after **30 days of inactivity**, and from *Cool* to *Archive* after **90 days**.

### How to Set Up Lifecycle Rules

In the Azure Portal: navigate to your Storage Account → **Data Management** → **Lifecycle Management** → click **Add a Rule**. You can apply the rule to *all blobs* in the account or **limit it with filters** (by container name or blob name prefix).

### Practical Example

Imagine you upload movie poster images for a streaming service. New posters are viewed frequently (Hot tier). After 30 days, older posters are accessed less (move to Cool). After 180 days, archived posters are rarely viewed (move to Archive). Lifecycle rules automate this entire process.

### Accessing Storage Accounts

To connect to a storage account programmatically, you need **Access Keys** and **Connection Strings**. These can be found in the Azure Portal under your storage account's *Security + Networking* → *Access Keys*. You can also use [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/) — a free desktop tool for browsing and managing your storage data.

### Data Protection — Soft Delete

Azure provides **soft delete** options that allow you to recover accidentally deleted files within a defined **retention period** (e.g., 7 days, 14 days). To configure this: go to **Data Management** → **Data Protection** → enable *Soft Delete* and set the retention period.`,
      keyPoints: [
        'Lifecycle Management automates tier transitions (Hot → Cool → Archive) based on rules.',
        'Rehydration is required to access archived data and can take hours.',
        'Access Keys and Connection Strings are used to connect to storage accounts programmatically.',
        'Soft Delete allows recovery of deleted files within a configurable retention period.'
      ]
    },

    /* ──────────────── 6. Storage Redundancy & SLAs ─────────────────── */
    {
      title: 'Storage Redundancy & SLAs',
      image: '/images/azure-devops/redundancy-options.svg',
      content:
`Data protection is critical in the cloud. Azure provides multiple **redundancy options** to ensure your data survives hardware failures, data center outages, and even regional disasters.

### Azure Infrastructure Hierarchy

Understanding the physical structure helps you appreciate redundancy. **Servers** sit in racks inside **Data Centers** (individual buildings). Multiple data centers form an **Availability Zone**. Multiple availability zones form a **Region** (a city or metro area). Regions are grouped into **Geographies** (countries or continents).

### Redundancy Options

**LRS (Locally Redundant Storage)** — Stores **3 copies** of your data within a **single data center** in one region. Protects against server or rack failures. This is the cheapest option but does not protect against data center outages.

**ZRS (Zone-Redundant Storage)** — Stores **3 copies** across **3 availability zones** within one region. Protects against an entire data center going down. Recommended for high-availability applications.

**GRS (Geo-Redundant Storage)** — Stores **6 copies** — 3 in the primary region and 3 in a **secondary region** hundreds of miles away. Protects against regional disasters like earthquakes or floods.

**GZRS (Geo-Zone-Redundant Storage)** — Combines ZRS and GRS. Stores **6 copies** across **4 data centers** and **2 regions**. This offers the highest level of protection.

### Read Access (The RA Factor)

By default, the secondary region in GRS or GZRS is a **"dark" standby** — you cannot read from it. If you want to read data from the secondary region even when the primary is healthy, use **RA-GRS** or **RA-GZRS** (Read-Access versions). This provides a secondary **read-only endpoint** that is great for load balancing.

### Service Level Agreements (SLAs)

Azure SLAs define the expected **uptime and reliability** for each service. For example, Azure Storage guarantees at least **99.9% availability** for LRS and higher for GRS/GZRS. Choosing the right redundancy strategy should be based on your **business requirements** and how much downtime your application can tolerate.`,
      keyPoints: [
        'LRS: 3 copies in 1 data center — cheapest but no protection against data center outage.',
        'ZRS: 3 copies across 3 availability zones — protects against data center failures.',
        'GRS: 6 copies across 2 regions — protects against regional disasters.',
        'RA-GRS/RA-GZRS adds a read-only secondary endpoint for load balancing and high availability.'
      ]
    },

    /* ──────────────── 7. PowerShell Fundamentals ──────────────────── */
    {
      title: 'PowerShell Fundamentals',
      content:
`**PowerShell** is a powerful command-line shell and scripting language built on .NET. It is the primary tool for managing Azure resources through the command line. Before working with Azure, you should be comfortable with basic PowerShell commands.

### Essential Commands

**\`PWD\`** (Print Working Directory) — Displays the current directory you are in. **\`LS\`** (or \`Get-ChildItem\`) — Lists all files and folders in the current directory. **\`CD\`** (Change Directory) — Navigates to a different folder. Use \`CD ..\` to go up one level. **\`MKDIR\`** (Make Directory) — Creates a new folder. **\`New-Item\`** — Creates a new file. Example: \`New-Item -Name "test.txt" -ItemType "File"\`. **\`Remove-Item\`** (or \`RM\`) — Deletes a file or folder. **\`CAT\`** (or \`Get-Content\`) — Reads and displays the contents of a file. **\`Move-Item\`** (or \`MV\`) — Moves a file from one location to another. **\`Copy-Item\`** (or \`CP\`) — Copies a file from one location to another.

### Why PowerShell for Azure?

PowerShell is deeply integrated with Azure through the **Az module**. You can create, configure, and delete any Azure resource using PowerShell commands. This is especially useful for **automation, scripting, and Infrastructure as Code (IaC)** — tasks that would take many clicks in the Azure Portal can be done with a single command.`,
      code: `# Display current directory\nPWD\n\n# List files and folders\nLS\nGet-ChildItem\n\n# Navigate to a folder\nCD C:\\Projects\nCD ..   # Go up one level\n\n# Create a new folder\nMKDIR MyNewFolder\n\n# Create a new file\nNew-Item -Name "notes.txt" -ItemType "File"\n\n# Read file contents\nCAT notes.txt\nGet-Content notes.txt\n\n# Move a file\nMove-Item notes.txt C:\\Archive\\notes.txt\n\n# Copy a file\nCopy-Item notes.txt C:\\Backup\\notes.txt\n\n# Delete a file\nRemove-Item notes.txt`,
      codeLabel: 'Basic PowerShell Commands',
      keyPoints: [
        'PWD, LS, CD, MKDIR, CAT are essential navigation commands.',
        'New-Item creates files, Remove-Item deletes them, Move-Item and Copy-Item transfer them.',
        'PowerShell is the primary command-line tool for Azure management via the Az module.',
        'Learning PowerShell basics is a prerequisite for Azure automation and scripting.'
      ]
    },

    /* ──────────────── 8. Operators, Conditions & Loops ─────────────── */
    {
      title: 'Operators, Conditions & Loops',
      content:
`To write effective PowerShell scripts for Azure automation, you need to understand **operators**, **conditional statements**, and **loops**. These are the building blocks of any script.

### Mathematical Operators

PowerShell supports standard arithmetic: **\`+\`** (addition), **\`-\`** (subtraction), **\`*\`** (multiplication), **\`/\`** (division). Example: \`$result = 10 / 2\` gives \`5\`.

### Comparison Operators

Unlike most programming languages, PowerShell uses **word-based comparison operators**: **\`-eq\`** (equal to), **\`-ne\`** (not equal to), **\`-gt\`** (greater than), **\`-lt\`** (less than), **\`-ge\`** (greater than or equal), **\`-le\`** (less than or equal). These are used inside \`if\` statements to control the flow of your script.

### Conditional Statements

The \`if/else\` statement lets your script make decisions. This is essential for Azure automation — for example, checking if a resource exists before creating it.

### Loops

**For Loop** — Used when you know the exact number of iterations. You control the index variable manually. **Foreach Loop** — Simplifies iterating over collections (arrays, lists) without managing an index. More readable and commonly used. **ForEach-Object** — Used in pipelines to process each object passed through. Uses \`$_\` to represent the current item.`,
      code: `# Mathematical operators\n$result = 1 + 2    # Output: 3\n$result = 10 / 2   # Output: 5\n\n# Comparison operators\n$a = 10; $b = 20\nif ($a -eq $b) { "Equal" }\nif ($a -lt $b) { "A is less than B" }\n\n# Conditional statement example\n$shoePrice = 2500\nif ($shoePrice -lt 3000) {\n    Write-Host "Buy the shoes at $shoePrice"\n} else {\n    Write-Host "Don't buy the shoes"\n}\n\n# For Loop\nfor ($i = 1; $i -le 5; $i++) {\n    Write-Host "Number: $i"\n}\n\n# Foreach Loop\n$colors = @("Red", "Green", "Blue")\nforeach ($color in $colors) {\n    Write-Host "Color: $color"\n}\n\n# ForEach-Object (pipeline)\n1..5 | ForEach-Object {\n    Write-Host "Number: $_"\n}`,
      codeLabel: 'Operators, Conditions & Loops',
      keyPoints: [
        'PowerShell uses -eq, -ne, -gt, -lt, -ge, -le for comparisons (not ==, !=, >, <).',
        'If/else statements control script flow based on conditions.',
        'For loop: best for known iteration counts. Foreach: best for collections. ForEach-Object: best for pipelines.',
        'These constructs are essential for writing Azure automation scripts.'
      ]
    },

    /* ──────────────── 9. PowerShell Commands for Azure ─────────────── */
    {
      title: 'PowerShell Commands for Azure',
      content:
`The **Az PowerShell module** is the official module for managing Azure resources from the command line. It provides cmdlets for creating, reading, updating, and deleting virtually any Azure resource.

### Step 1 — Install the Az Module

Before interacting with Azure, install the module using: \`Install-Module -Name Az -AllowClobber -Scope CurrentUser\`. This downloads and installs all the necessary cmdlets.

### Step 2 — Connect to Azure

Run \`Connect-AzAccount\` to sign in to your Azure account. A browser window will open for authentication. Once signed in, PowerShell remembers your session.

### Key Commands for Resource Management

**\`Get-AzResourceGroup\`** — Retrieves all resource groups in your subscription. **\`New-AzResourceGroup\`** — Creates a new resource group. **\`Remove-AzResourceGroup\`** — Deletes a resource group and *all* its resources. Use \`-Force\` to skip the confirmation prompt.

### Key Commands for Storage

**\`New-AzStorageAccount\`** — Creates a new storage account. **\`Get-AzStorageAccount\`** — Retrieves storage account details and its context. **\`New-AzStorageContainer\`** — Creates a blob container. **\`Get-AzStorageContainer\`** — Lists all containers. **\`Remove-AzStorageContainer\`** — Deletes a container.`,
      code: `# Install the Azure PowerShell module\nInstall-Module -Name Az -AllowClobber -Scope CurrentUser\n\n# Connect to Azure\nConnect-AzAccount\n\n# Get all resource groups\n$resourceGroups = Get-AzResourceGroup\n$resourceGroups | Format-Table -Property ResourceGroupName, Location\n\n# Create a resource group\nNew-AzResourceGroup -Name "MyResourceGroup" -Location "EastUS"\n\n# Delete a resource group\nRemove-AzResourceGroup -Name "MyResourceGroup" -Force\n\n# Create a storage account\nNew-AzStorageAccount -ResourceGroupName "MyResourceGroup" \\\n  -Name "mystorageaccount2026" -Location "EastUS" -Sku "Standard_LRS"\n\n# Get storage context\n$storageAccount = Get-AzStorageAccount -ResourceGroupName "MyResourceGroup" \\\n  -Name "mystorageaccount2026"\n$context = $storageAccount.Context\n\n# Create a blob container\nNew-AzStorageContainer -Name "mycontainer" -Context $context\n\n# List containers\nGet-AzStorageContainer -Context $context | Format-Table\n\n# Delete a container\nRemove-AzStorageContainer -Name "mycontainer" -Context $context -Force`,
      codeLabel: 'Azure PowerShell Commands',
      keyPoints: [
        'Install the Az module first with Install-Module -Name Az.',
        'Connect-AzAccount opens a browser for authentication.',
        'New-AzResourceGroup and New-AzStorageAccount are the most common creation commands.',
        'Always use -Force carefully — it skips confirmation and can delete resources permanently.'
      ]
    },

    /* ──────────────── 10. Binary Numbers & IP Addresses ─────────────── */
    {
      title: 'Binary Numbers & IP Addresses',
      content:
`Understanding **binary numbers** and **IP addresses** is essential before working with Azure networking concepts like Virtual Networks and Subnets.

### Binary Number System

Computers operate using the **binary system** (base-2), which uses only two digits: **0** and **1**. Each digit is called a **bit**. The number of values representable with *n* bits is **2^n**. For example: **1 bit** = 2 values (0, 1). **2 bits** = 4 values (0–3). **4 bits** = 16 values (0–15). **8 bits** = 256 values (0–255).

### IP Address Structure

An **IP address** consists of **four octets** (blocks) separated by dots. Each octet is represented by **8 bits**, meaning each value must be between **0 and 255**. For example: \`192.168.1.1\` is **valid** (all values are 0–255). \`256.100.50.25\` is **invalid** (256 requires 9 bits and exceeds the 8-bit limit).

### CIDR Notation

**CIDR (Classless Inter-Domain Routing)** notation is a method for representing IP address ranges. It includes an IP address and a **subnet mask** number after a slash. For example: \`10.0.0.0/16\` means the first 16 bits are the **network portion** and the remaining 16 bits are available for **host addresses**. The smaller the number after the slash, the larger the network.

### Private vs Public IP Addresses

**Private IP addresses** are used within internal networks and can be reused across different networks. The reserved private ranges are: \`10.0.0.0\` to \`10.255.255.255\` (Class A), \`172.16.0.0\` to \`172.31.255.255\` (Class B), \`192.168.0.0\` to \`192.168.255.255\` (Class C). **Public IP addresses** must be globally unique on the internet and are assigned by your Internet Service Provider or cloud provider.

### Subnetting

**Subnetting** is the process of dividing a larger network into smaller, manageable sub-networks. This improves security, performance, and organization. The subnet mask determines how many IP addresses are available in each subnet.`,
      keyPoints: [
        'Each IP octet is 8 bits, so valid values are 0–255. Any value above 255 makes the IP invalid.',
        'CIDR notation (e.g., /16, /24) defines how many bits are for the network vs host addresses.',
        'Private IPs (10.x.x.x, 172.16–31.x.x, 192.168.x.x) are reusable; Public IPs must be globally unique.',
        'Subnetting divides large networks into smaller segments for better security and management.'
      ]
    },

    /* ──────────────── 11. Virtual Networks & Subnets ─────────────────── */
    {
      title: 'Virtual Networks & Subnets',
      image: '/images/azure-devops/vnet-subnets.svg',
      content:
`A **Virtual Network (VNet)** is the backbone of your Azure networking. It provides a **secure, private network environment** within the Azure cloud, allowing your resources to communicate with each other, the internet, and on-premises networks.

### Why Virtual Networks?

Think of a VNet as a *virtual representation of a physical network*. Just like offices have internal networks with different departments, Azure VNets let you isolate and segment your resources logically. Resources in the same VNet can communicate; resources in different VNets cannot (unless explicitly connected).

### Creating a Virtual Network

In the Azure Portal: search for **"Virtual Network"** → click **Create** → select a resource group → provide a unique name (e.g., \`test-vnet\`) → choose a **region** (e.g., East US) → define an **address space** using CIDR notation (e.g., \`10.0.0.0/16\`, which provides 65,536 IP addresses) → click **Create**.

### Creating Subnets

After creating the VNet, you divide it into **subnets**. Each subnet gets its own address range within the VNet's address space. For example: **Public Subnet**: \`10.0.1.0/24\` (256 addresses) for web servers. **Private Subnet**: \`10.0.2.0/24\` (256 addresses) for databases.

### Important Rules

**No overlapping addresses** — Subnet address ranges within the same VNet must not overlap. **Azure reserves 5 IPs** — In every subnet, Azure reserves 5 IP addresses for internal use (network address, default gateway, DNS mapping, and broadcast). So a \`/24\` subnet gives you **251 usable IPs**, not 256. **Cross-VNet communication** requires VNet Peering or VPN Gateway.

### Practical Use

After creating VNets and subnets, you can deploy resources like **Virtual Machines** into specific subnets. This allows you to control network traffic using **Network Security Groups (NSGs)** and ensure that sensitive resources (like databases) are isolated from public-facing services.`,
      keyPoints: [
        'A VNet is a private, isolated network in Azure — the foundation for all networking.',
        'Subnets divide a VNet into segments (public, private) for security and organization.',
        'Azure reserves 5 IPs per subnet, so a /24 subnet gives 251 usable addresses, not 256.',
        'Subnet address ranges must not overlap within the same VNet.'
      ]
    },

    /* ──────────────── 12. Virtual Machines ───────────────────────────── */
    {
      title: 'Virtual Machines',
      image: '/images/azure-devops/vm-components.svg',
      content:
`A **Virtual Machine (VM)** is a software emulation of a physical computer. It runs an operating system and applications just like a real computer, but it exists entirely in the cloud. VMs are the most fundamental **IaaS (Infrastructure as a Service)** resource in Azure.

### Components of a Virtual Machine

**Compute** — The CPU and memory (RAM) allocated to the VM. You choose the *size* based on workload requirements. **Storage** — Managed disks that store the operating system and application data. **Networking** — The VM connects to a VNet through a *Network Interface Card (NIC)*, and optionally gets a public IP. **Operating System** — Choose between *Windows* (connected via RDP) or *Linux* (connected via SSH). **Management Tools** — Azure Monitor, Azure Portal, and CLI help you manage and monitor the VM.

### Steps to Create a VM

In the Azure Portal: click **"Create a Resource"** → select **"Virtual Machine"** → configure the basics: *Name, Region, Image (OS), Size (CPU/RAM)* → set up **authentication** (SSH key for Linux, Password for Windows) → configure **networking** (connect to a VNet, assign a public IP if needed) → click **Review + Create** → click **Create** to deploy.

### Connecting to Your VM

**Windows VMs** — Use **Remote Desktop Protocol (RDP)** on port 3389. Open the Remote Desktop Connection app, enter the VM's public IP address, and log in with your credentials. **Linux VMs** — Use **Secure Shell (SSH)** on port 22. Open a terminal and run: \`ssh username@public-ip-address\`. SSH keys are recommended over passwords for better security.

### Billing Considerations

VMs incur charges based on **size, running time, storage, and data transfer**. **Important:** Costs are incurred even when a VM is *stopped* (but not deallocated). To completely stop billing, you must **deallocate** the VM, which releases the compute resources. Azure offers free tier options for new users under specific conditions.`,
      code: `# Create a resource group\naz group create --name MyResourceGroup --location eastus\n\n# Create a Linux VM\naz vm create \\\n  --resource-group MyResourceGroup \\\n  --name MyLinuxVM \\\n  --image UbuntuLTS \\\n  --admin-username azureuser \\\n  --generate-ssh-keys\n\n# Connect to the VM via SSH\nssh azureuser@<public-ip-address>\n\n# Start / Stop / Deallocate a VM\naz vm start --resource-group MyResourceGroup --name MyLinuxVM\naz vm stop --resource-group MyResourceGroup --name MyLinuxVM\naz vm deallocate --resource-group MyResourceGroup --name MyLinuxVM\n\n# Delete a VM\naz vm delete --resource-group MyResourceGroup --name MyLinuxVM --yes`,
      codeLabel: 'VM Management Commands',
      keyPoints: [
        'A VM is a cloud-based computer with Compute, Storage, Networking, and OS components.',
        'Windows VMs use RDP (port 3389); Linux VMs use SSH (port 22) for connection.',
        'Stopped VMs still incur costs — you must deallocate to stop all charges.',
        'SSH keys are more secure than passwords for Linux VM authentication.'
      ]
    },

    /* ──────────────── 13. NICs, Ports & Network Security ────────────── */
    {
      title: 'NICs, Ports & Network Security',
      content:
`Networking is where Azure infrastructure starts to feel like real engineering. Understanding **Network Interface Cards (NICs)**, **ports**, and **Network Security Groups (NSGs)** is critical for securing your resources.

### Network Interface Card (NIC)

A **NIC** is the component that enables a VM to communicate on a network. Every VM must have at least one NIC. The NIC is assigned both a **private IP** (for internal communication within the VNet) and optionally a **public IP** (for external access from the internet). Key fact: **IP addresses are associated with NICs**, not directly with VMs.

### Ports and Protocols

**Ports** are numbered endpoints that determine which service receives incoming data. Think of an IP address as a building's street address, and ports as individual apartment numbers. Common ports include: **Port 22** — SSH (Linux remote access). **Port 80** — HTTP (web traffic). **Port 443** — HTTPS (secure web traffic). **Port 1433** — SQL Server. **Port 3389** — RDP (Windows remote access).

### Network Security Groups (NSGs)

An **NSG** acts as a virtual firewall that controls **inbound and outbound traffic** to your Azure resources. Think of it as a *security guard* that checks every incoming and outgoing request against a list of rules. Each rule specifies: **Priority** (lower number = higher priority), **Source/Destination** (IP address or range), **Port**, **Protocol** (TCP, UDP), and **Action** (Allow or Deny).

### NSG Best Practices

Apply NSGs at the **subnet level** for broad protection and at the **NIC level** for resource-specific rules. Start with a **deny all** approach and explicitly allow only the traffic you need. This follows the *principle of least privilege*. Regularly review and audit your NSG rules to ensure no unnecessary ports are open.`,
      keyPoints: [
        'NICs connect VMs to the network — IP addresses belong to the NIC, not the VM directly.',
        'Common ports: SSH (22), HTTP (80), HTTPS (443), SQL (1433), RDP (3389).',
        'NSGs act as virtual firewalls controlling inbound/outbound traffic based on priority rules.',
        'Apply the principle of least privilege — deny all by default and allow only what is needed.'
      ]
    },

    /* ──────────────── 14. Securing Storage Accounts ──────────────────── */
    {
      title: 'Securing Storage Accounts',
      content:
`Securing your Azure Storage Accounts is essential to prevent unauthorized access to your data. Azure provides several security mechanisms including **firewalls, IP whitelisting, and Shared Access Signatures (SAS)**.

### Network Rules & IP Whitelisting

By default, storage accounts accept connections from all networks. To restrict access: go to your Storage Account → **Networking** (left menu) → enable the **Firewall**. You can then **whitelist specific IP addresses** — only requests from these IPs will be allowed. To find your public IP, visit a service like "What is my IP" and add it to the allowed list.

### Limitations

Azure allows up to **200 IP address rules** per storage account. If users have *dynamic IP addresses* (which change frequently), you will need to update the whitelist regularly. For larger teams, consider using **Virtual Network service endpoints** or **Private Endpoints** instead.

### Shared Access Signatures (SAS)

**SAS tokens** provide *granular, time-limited access* to your storage resources. Instead of sharing your storage account key (which gives full access), you generate a SAS token that specifies: **what resources** can be accessed, **what permissions** are granted (read, write, delete), **when the token expires**, and **which IP addresses** can use it. SAS tokens are much more secure than sharing access keys directly.

### Best Practices for Storage Security

**Never share access keys** in code repositories or plain text. Use **Azure Key Vault** to store connection strings and keys securely. Enable **soft delete** to protect against accidental data loss. Use **SAS tokens** for external or temporary access instead of full access keys. Enable **Azure Defender for Storage** to detect unusual access patterns and potential threats.`,
      keyPoints: [
        'Enable Firewall and whitelist IP addresses to restrict access to your storage account.',
        'SAS tokens provide granular, time-limited access — much safer than sharing full access keys.',
        'Use Virtual Network service endpoints or Private Endpoints for enterprise-level security.',
        'Store connection strings and keys in Azure Key Vault, never in code repositories.'
      ]
    },

    /* ──────────────── 15. Azure CLI Commands ──────────────────────── */
    {
      title: 'Azure CLI Commands',
      content:
`The **Azure CLI** (\`az\`) is a cross-platform command-line tool for managing Azure resources. It works on Windows, macOS, and Linux, and is an alternative to PowerShell for teams that prefer a bash-style syntax.

### Installing Azure CLI

Download from [https://learn.microsoft.com/en-us/cli/azure/install-azure-cli](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) or install via package managers. On Windows, you can use \`winget install Microsoft.AzureCLI\`. Verify with \`az --version\`.

### Key Commands for Common Resources

The Azure CLI follows a consistent pattern: \`az <resource-type> <action> --parameters\`. This makes commands easy to discover and remember.`,
      code: `# Login to Azure\naz login\n\n# Create a Resource Group\naz group create --name MyResourceGroup --location eastus\n\n# Create a Virtual Network\naz network vnet create --name MyVNet \\\n  --resource-group MyResourceGroup --subnet-name MySubnet\n\n# Create a Public IP Address\naz network public-ip create --name MyPublicIP \\\n  --resource-group MyResourceGroup --allocation-method Dynamic\n\n# Create a Network Interface Card (NIC)\naz network nic create --resource-group MyResourceGroup \\\n  --name MyNIC --vnet-name MyVNet --subnet MySubnet \\\n  --public-ip-address MyPublicIP\n\n# Create a Virtual Machine\naz vm create --resource-group MyResourceGroup --name MyVM \\\n  --nics MyNIC --image UbuntuLTS \\\n  --admin-username azureuser --generate-ssh-keys\n\n# Start / Stop / Delete a VM\naz vm start --resource-group MyResourceGroup --name MyVM\naz vm stop --resource-group MyResourceGroup --name MyVM\naz vm delete --resource-group MyResourceGroup --name MyVM --yes`,
      codeLabel: 'Azure CLI Resource Management',
      keyPoints: [
        'Azure CLI uses a consistent pattern: az <resource> <action> --parameters.',
        'az login authenticates your session; az group create makes a resource group.',
        'You can create VNets, Public IPs, NICs, and VMs entirely from the command line.',
        'Azure CLI works on Windows, macOS, and Linux — great for cross-platform teams.'
      ]
    },

    /* ──────────────── 16. Creating a .NET Application ────────────────── */
    {
      title: 'Creating a .NET Application',
      content:
`**.NET** is Microsoft's open-source development platform for building web applications, APIs, microservices, and more. Understanding how to create and build a .NET application is important because many Azure DevOps pipelines are built around .NET workflows.

### Step 1 — Install the .NET SDK

Download the .NET SDK from the [official .NET website](https://dotnet.microsoft.com/download). Follow the installation wizard for your operating system. Verify the installation by running \`dotnet --version\` in your terminal.

### Step 2 — Create a New Application

Use the .NET CLI to scaffold a new project. The command \`dotnet new webapp -n MyWebApp\` creates a new web application named "MyWebApp." You can replace \`webapp\` with other templates like \`console\` (console app), \`webapi\` (REST API), or \`mvc\` (MVC web app).

### Step 3 — Key .NET CLI Commands

**\`dotnet restore\`** — Downloads all required NuGet packages and dependencies your application needs. **\`dotnet build\`** — Compiles the application code into machine-readable output. This step validates that your code has no compilation errors. **\`dotnet run\`** — Starts the application locally (typically accessible at \`http://localhost:5000\`). **\`dotnet publish -c Release\`** — Packages the application for deployment, generating output files (DLL/EXE) ready to be deployed to Azure.

### Why This Matters for Azure DevOps

Most Azure DevOps CI/CD pipelines for .NET applications follow these exact steps: **restore** → **build** → **test** → **publish**. Understanding these commands helps you read and write pipeline YAML files effectively.`,
      code: `# Create a new web application\ndotnet new webapp -n MyWebApp\n\n# Navigate to the project\ncd MyWebApp\n\n# Restore dependencies\ndotnet restore\n\n# Build the application\ndotnet build\n\n# Run locally (http://localhost:5000)\ndotnet run\n\n# Publish for deployment\ndotnet publish -c Release\n\n# List available templates\ndotnet new list\n\n# Get help\ndotnet help`,
      codeLabel: '.NET CLI Commands',
      keyPoints: [
        'dotnet new creates projects from templates (webapp, console, webapi, mvc).',
        'The standard workflow is: restore → build → test → publish.',
        'dotnet publish -c Release generates deployment-ready output (DLL/EXE files).',
        'These commands map directly to Azure DevOps pipeline steps.'
      ]
    },

    /* ──────────────── 17. Cloud Service Models ──────────────────────── */
    {
      title: 'Cloud Service Models (IaaS, PaaS, SaaS)',
      image: '/images/azure-devops/service-models.svg',
      content:
`Cloud computing offers different levels of abstraction. Understanding the **service models** helps you choose the right Azure service for your workload.

### On-Premises

In the **on-premises** model, your organization owns and manages *everything* — hardware, networking, operating systems, runtime, applications, and data. This requires a large upfront investment, a dedicated IT team, and ongoing maintenance. You have full control but also full responsibility.

### IaaS (Infrastructure as a Service)

With **IaaS**, the cloud provider manages the *physical hardware and networking*. You manage everything else — the operating system, runtime, applications, and data. Azure example: **Virtual Machines (VMs)**. IaaS gives you maximum control and flexibility, similar to renting a bare apartment where you bring your own furniture.

### PaaS (Platform as a Service)

With **PaaS**, the provider manages hardware, networking, *operating system, and runtime*. You only manage your *applications and data*. Azure example: **Azure App Service, Azure SQL Database**. PaaS lets developers focus purely on coding without worrying about infrastructure. It is like renting a furnished apartment — everything is set up, you just move in.

### SaaS (Software as a Service)

With **SaaS**, the provider manages *everything* — you simply use the software through a web browser. Examples: **Microsoft 365, Gmail, Salesforce, Azure DevOps itself**. SaaS is like staying at a hotel — everything is provided and maintained for you.

### Choosing the Right Model

**Use IaaS** when you need full control over the OS and installed software (e.g., legacy applications). **Use PaaS** when you want to focus on coding without managing servers (e.g., modern web apps). **Use SaaS** when you just need to use a tool without any setup (e.g., email, project management).`,
      keyPoints: [
        'On-Premises: you manage everything. IaaS: provider manages hardware. PaaS: provider manages OS + runtime. SaaS: provider manages everything.',
        'Azure VMs are IaaS; Azure App Service is PaaS; Microsoft 365 is SaaS.',
        'PaaS is ideal for developers who want to focus on code without managing infrastructure.',
        'Choose the model based on how much control vs convenience you need.'
      ]
    },

    /* ──────────────── 18. App Service & Deployment ───────────────────── */
    {
      title: 'App Service & Deployment',
      content:
`**Azure App Service** is a fully managed **PaaS** platform for hosting web applications, REST APIs, and mobile backends. It supports .NET, Java, Node.js, Python, PHP, and Ruby — you deploy your code and Azure handles the rest.

### Understanding App Service Plan

An **App Service Plan** defines the *compute resources* (CPU, RAM, storage) available to your web apps. Think of it as the "machine" your app runs on. You choose a **pricing tier** that determines performance and features. Multiple App Services can share the same Plan, which is cost-effective.

### Creating an App Service

In the Azure Portal: go to **"Create a Resource"** → search **"Web App"** → click **Create**. Select your subscription and resource group, give it a **unique name** (this becomes your URL: \`yourapp.azurewebsites.net\`), choose the **runtime stack** (e.g., .NET 8), select a **region**, and choose or create an **App Service Plan**. Click **Review + Create** → **Create**.

### Deploying a .NET Application

**Step 1:** In your terminal, navigate to your project directory. **Step 2:** Run \`dotnet restore\` to download dependencies. **Step 3:** Run \`dotnet build\` to compile. **Step 4:** Run \`dotnet publish -c Release\` to create deployment files. **Step 5:** In the Azure Portal, go to your App Service → **Deployment Center** → choose your deployment method (Local Git, GitHub, FTP, or Azure DevOps). **Step 6:** Upload the published files to the \`wwwroot\` directory. **Step 7:** **Restart** the App Service to apply changes.

### Deployment Methods

**Local Git** — Push code directly from your machine to Azure. **GitHub/Azure Repos** — Connect your repository for automatic deployments on push. **FTP** — Manually upload files using an FTP client. **Azure DevOps Pipelines** — Automated CI/CD (the recommended approach for teams).`,
      keyPoints: [
        'App Service is Azure\'s PaaS for hosting web apps — you deploy code, Azure manages infrastructure.',
        'An App Service Plan defines the compute resources; multiple apps can share one plan.',
        'Deployment options include Local Git, GitHub, FTP, and Azure DevOps Pipelines.',
        'The standard .NET deployment flow is: restore → build → publish → deploy.'
      ]
    },

    /* ──────────────── 19. Scaling in Azure ───────────────────────────── */
    {
      title: 'Scaling in Azure',
      image: '/images/azure-devops/scaling-comparison.svg',
      content:
`As your application grows, you will need to **scale** your resources to handle increased traffic and workload. Azure supports two fundamental scaling strategies.

### Vertical Scaling (Scale Up / Scale Down)

**Vertical scaling** means adding *more power* (CPU, RAM, storage) to your existing machine. **Scale Up** — Upgrade to a more powerful pricing tier (e.g., from 4 GB RAM to 8 GB RAM). **Scale Down** — Downgrade to a smaller tier to save costs during low-traffic periods. Vertical scaling is simpler to implement but has a **hardware limit** — there is a maximum size for any single machine.

### Horizontal Scaling (Scale Out / Scale In)

**Horizontal scaling** means adding *more instances* (machines) to share the load. **Scale Out** — Add more instances (e.g., from 2 servers to 5 servers). **Scale In** — Reduce instances when traffic decreases. Horizontal scaling has **no upper limit** and provides **redundancy** — if one instance fails, others continue serving traffic.

### How to Scale in Azure App Service

In the Azure Portal: go to your **App Service Plan** → **Scale Up** (for vertical scaling) — choose a larger pricing tier. → **Scale Out** (for horizontal scaling) — increase the instance count.

### Auto Scaling

Azure supports multiple scaling options: **Manual Scaling** — You manually adjust instance count or pricing tier. **Rule-Based Auto Scaling** — Set rules like "if CPU exceeds 70%, add an instance" and "if CPU drops below 20%, remove an instance." **Automatic Scaling** — Azure intelligently manages scaling based on traffic patterns without requiring detailed user configuration.

### Key Point

All scaling is performed at the **App Service Plan level**, which then affects *all App Services* running on that plan. This means scaling one plan can improve performance for multiple applications.`,
      keyPoints: [
        'Vertical Scaling (Up/Down): add more power to one machine — simpler but has hardware limits.',
        'Horizontal Scaling (Out/In): add more machines — no limit, provides redundancy and fault tolerance.',
        'Auto scaling rules can automatically adjust instances based on CPU, memory, or request count.',
        'Scaling happens at the App Service Plan level and affects all apps running on that plan.'
      ]
    },

    /* ──────────────── 20. Infrastructure as Code (ARM Templates) ────── */
    {
      title: 'Infrastructure as Code (ARM Templates)',
      content:
`**Infrastructure as Code (IaC)** is the practice of managing cloud infrastructure through *code and automation* rather than manual portal clicks. IaC increases efficiency, ensures consistency, and reduces human error.

### Why IaC?

Without IaC, creating environments is manual, error-prone, and hard to reproduce. With IaC, your entire infrastructure becomes **versioned, reviewable, and repeatable** — just like application code.

### IaC Approaches

**Imperative Approach** — You write step-by-step commands that tell the system *exactly how* to create resources (e.g., Azure CLI scripts). **Declarative Approach** — You describe the *desired end state* and the tool figures out how to achieve it (e.g., ARM templates, Terraform).

### ARM Templates

**Azure Resource Manager (ARM) templates** are JSON files that define the infrastructure you want to deploy in Azure. They follow the *declarative approach* — you describe what you want, and Azure creates it.

### ARM Template Structure

An ARM template contains: **\`$schema\`** — The template schema version. **\`contentVersion\`** — Your template's version number. **\`parameters\`** — Values passed at deployment time (e.g., storage account name). **\`variables\`** — Reusable values within the template. **\`resources\`** — The Azure resources to create. **\`outputs\`** — Values returned after deployment.

### Parameters & Variables

**Parameters** allow you to pass custom values at deploy time, making templates reusable across environments. **Variables** store calculated or repeated values to reduce redundancy in the template.`,
      code: `// ARM Template Example (storage.json)\n{\n  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",\n  "contentVersion": "1.0.0.0",\n  "parameters": {\n    "storageAccountName": {\n      "type": "string",\n      "metadata": { "description": "Name of the storage account" }\n    }\n  },\n  "variables": {\n    "storageType": "Standard_LRS"\n  },\n  "resources": [\n    {\n      "type": "Microsoft.Storage/storageAccounts",\n      "apiVersion": "2021-02-01",\n      "name": "[parameters('storageAccountName')]",\n      "location": "[resourceGroup().location]",\n      "sku": { "name": "[variables('storageType')]" },\n      "kind": "StorageV2"\n    }\n  ]\n}\n\n// Deploy with Azure CLI\naz deployment group create \\\n  --resource-group MyResourceGroup \\\n  --template-file storage.json \\\n  --parameters storageAccountName=mystorageaccount`,
      codeLabel: 'ARM Template & Deployment',
      keyPoints: [
        'IaC replaces manual portal clicks with versioned, repeatable code.',
        'ARM templates use JSON and the declarative approach — describe what you want, Azure creates it.',
        'Parameters make templates reusable; Variables reduce repetition within a template.',
        'Deploy ARM templates via Azure CLI, PowerShell, or CI/CD pipelines.'
      ]
    },

    /* ──────────────── 21. Resource Providers & Types ─────────────────── */
    {
      title: 'Resource Providers & Types',
      content:
`When you create resources in Azure, you interact with **Resource Providers** — services that supply specific types of Azure resources. Understanding resource providers helps you write ARM templates and work with Azure APIs.

### What is a Resource Provider?

A **Resource Provider** is a service within Azure that offers a specific set of resources. Each provider has a **namespace** that identifies it. When you define a resource in an ARM template or CLI command, you specify the provider namespace and resource type.

### Common Built-in Resource Providers

**Microsoft.Compute** — Provides virtual machines, VM scale sets, disks, and availability sets. **Microsoft.Storage** — Provides storage accounts, blob storage, file shares, queues, and tables. **Microsoft.Network** — Provides virtual networks, public IPs, load balancers, NICs, and NSGs. **Microsoft.Web** — Provides App Service, App Service Plans, and Function Apps. **Microsoft.Sql** — Provides Azure SQL databases and servers.

### Resource Type Format

Resource types follow the pattern: \`ProviderNamespace/ResourceType\`. For example: \`Microsoft.Compute/virtualMachines\` — A virtual machine. \`Microsoft.Storage/storageAccounts\` — A storage account. \`Microsoft.Network/virtualNetworks\` — A virtual network.

### Custom Resource Providers

Azure also allows you to create **custom resource providers** to extend Azure's capabilities with your own services. This is an advanced feature used by organizations that need to integrate proprietary services into the Azure management framework.

### Registering Resource Providers

Some resource providers need to be **registered** before use. You can check registered providers in the Azure Portal under *Subscriptions* → *Resource Providers*, or via CLI: \`az provider list --output table\`. Register a provider with: \`az provider register --namespace Microsoft.Compute\`.`,
      keyPoints: [
        'Resource Providers supply specific Azure resource types (e.g., Microsoft.Compute for VMs).',
        'Resource types follow the pattern: ProviderNamespace/ResourceType.',
        'Common providers: Microsoft.Compute, Microsoft.Storage, Microsoft.Network, Microsoft.Web.',
        'Some providers must be registered before use — check via Azure Portal or CLI.'
      ]
    },

    /* ──────────────── 22. Azure DevOps Portal & Projects ────────────── */
    {
      title: 'Azure DevOps Portal & Projects',
      content:
`**Azure DevOps** is Microsoft's end-to-end platform for planning work, storing source code, automating builds, releasing software, and managing internal package feeds. It gives teams one place to move from **idea to production** instead of stitching together separate tools.

### The Five Core Services

**Azure Boards** — Track work items including *epics, features, user stories, bugs, and tasks*. Supports Kanban boards, sprint planning, and dashboards. **Azure Repos** — Git-based source code management with *branch policies, pull request reviews*, and code search. **Azure Pipelines** — CI/CD automation using YAML or the classic editor. Supports builds, tests, and multi-stage deployments. **Azure Test Plans** — Manual and exploratory testing tools for quality assurance. **Azure Artifacts** — Host NuGet, npm, Maven, and Python package feeds for your team.

### Project Structure

Each **project** represents a separate development effort — one application, one platform area, or one team. Inside a project you get your own repositories, pipelines, boards, and dashboards. **Work Items** within each project include user stories, tasks, bugs, and epics, allowing teams to manage work effectively.

### Boards & Dashboards

**Boards** helps teams organize work into sprints and visualize it on **Kanban boards**. **Dashboards** surface real-time information: build health, deployment status, work item burndown, and team velocity. These make delivery progress visible to both engineers and stakeholders.

### Mental Model for Beginners

A useful way to think about Azure DevOps: **Boards** answers *what should be built*. **Repos** answers *where the code lives*. **Pipelines** answers *how changes are validated and released*. **Test Plans** answers *how quality is verified*. **Artifacts** answers *where reusable packages are shared*.`,
      keyPoints: [
        'Azure DevOps has five core services: Boards, Repos, Pipelines, Test Plans, and Artifacts.',
        'Projects are the top-level container for all code, work items, pipelines, and dashboards.',
        'Boards supports Kanban views, sprint planning, and work item tracking (epics, stories, bugs).',
        'Start with Repos and Pipelines — they provide the fastest early value for any team.'
      ]
    },

    /* ──────────────── 23. Repos, Branching & Pull Requests ──────────── */
    {
      title: 'Repos, Branching & Pull Requests',
      image: '/images/azure-devops/branching-strategy.svg',
      content:
`**Azure Repos** provides Git repositories with powerful policy controls that keep shared branches stable and code quality high.

### Branching Strategy

A **branching strategy** defines how code changes are managed and released. A well-defined strategy reduces merge conflicts and maintains a stable production environment.

### Common Branching Models

**Feature Branching** — Each new feature is developed in its own branch, allowing isolated development and easier integration. **Release Branching** — Used to prepare for production releases where final testing and bug fixes are applied. **Trunk-Based Development** — Developers work on small, incremental changes directly in the main branch, promoting continuous integration. **Hotfix Branching** — Emergency fixes branched directly from main for urgent production issues.

### A Practical Branching Model

**\`main\`** — Production-ready code. Only merged via pull requests. **\`development\`** — Integration branch where features are combined and tested. **\`feature/*\`** — Individual feature branches created from development. **\`release/*\`** — Stabilization branches for upcoming releases. **\`hotfix/*\`** — Emergency fixes branched from main.

### Branch Policies

This is where Azure Repos becomes much more than simple Git hosting. You can configure policies to: **require reviewers** before merge, **block direct pushes** to protected branches, **demand linked work items** for traceability, **enforce build validation** (CI must pass before merge), **require comment resolution**, and **limit who can complete** a pull request.

### Pull Request Workflow

Developers push their feature branch, then open a **Pull Request (PR)** into development or main. Reviewers examine the code, leave comments, and either *approve*, *request changes*, or add general *comments*. After all approvals and CI checks pass, the PR is merged.`,
      code: `# Typical Azure Repos workflow\ngit checkout development\ngit pull origin development\n\n# Create a feature branch\ngit checkout -b feature/user-profile\n\n# Make changes, stage, and commit\ngit add .\ngit commit -m "feat: add profile edit form"\n\n# Push to remote\ngit push -u origin feature/user-profile\n\n# Open a Pull Request into development or main\n# Protected branches should normally reject direct pushes\n\n# After PR is merged, clean up\ngit checkout development\ngit pull origin development\ngit branch -d feature/user-profile`,
      codeLabel: 'Branching Workflow',
      keyPoints: [
        'Use feature branches for isolated development and merge through pull requests.',
        'Protect main and development branches with reviewer and build-validation policies.',
        'Common strategies: Feature Branching, Release Branching, Trunk-Based, and Hotfix.',
        'Branch strategy exists to reduce risk and maintain a stable production environment.'
      ]
    },

    /* ──────────────── 24. CI/CD Pipelines (YAML) ────────────────────── */
    {
      title: 'CI/CD Pipelines (YAML)',
      image: '/images/azure-devops/ci-cd-flow.svg',
      content:
`**CI/CD (Continuous Integration / Continuous Deployment)** is the backbone of modern software delivery. Azure Pipelines lets you define your entire build and release process in **YAML** files stored alongside your application code.

### What is CI (Continuous Integration)?

CI means **automatically building and testing** your code whenever a new commit is pushed to the repository. The system generates **artifacts** (packaged output) and provides fast feedback — if something breaks, the team knows immediately.

### What is CD (Continuous Deployment)?

CD means **automatically deploying validated code changes** to one or more environments (dev, test, staging, production). Whenever a new build succeeds, the system deploys it without manual intervention.

### Pipeline Structure

A YAML pipeline follows a clear hierarchy: **Trigger** — The event that starts the pipeline (e.g., push to main, pull request, schedule). **Pool** — The agent that runs the pipeline (Microsoft-hosted or self-hosted). **Stages** — Major phases like Build, Test, Deploy. **Jobs** — Execution units within a stage. **Steps** — Individual scripts or tasks within a job.

### Setting Up CI/CD in Azure DevOps

**Step 1:** Create a new project in the Azure DevOps portal. **Step 2:** Set up a repository (Git) with your application code. **Step 3:** Define a Build Pipeline (CI) — go to *Pipelines → Builds → New Pipeline* → select your repo → configure with YAML. Include tasks to restore, build, test, and publish artifacts. **Step 4:** Define a Release Pipeline (CD) — go to *Pipelines → Releases → New Pipeline* → choose artifact source → define stages (dev, test, prod) → configure deployment tasks. **Step 5:** Set triggers for automatic deployment when new builds are available. **Step 6:** Monitor and verify your deployments in the Azure Portal.

### Artifacts & Environments

**Artifacts** are the build outputs (compiled code, packages). The key principle is **build once, deploy many** — you create one artifact and promote it through environments, rather than rebuilding for each stage. **Environments** in Azure DevOps attach **approval gates, checks, and deployment history** to each target, giving teams a controlled path from code to production.`,
      code: `trigger:\n  branches:\n    include:\n      - main\n\npool:\n  vmImage: 'ubuntu-latest'\n\nstages:\n- stage: Build\n  jobs:\n  - job: BuildAndPublish\n    steps:\n    - task: UseDotNet@2\n      inputs:\n        version: '8.x'\n    - script: dotnet restore\n      displayName: 'Restore dependencies'\n    - script: dotnet build --configuration Release\n      displayName: 'Build application'\n    - script: dotnet test --no-build --configuration Release\n      displayName: 'Run tests'\n    - script: dotnet publish -c Release -o $(Build.ArtifactStagingDirectory)\n      displayName: 'Publish output'\n    - task: PublishBuildArtifacts@1\n      inputs:\n        PathtoPublish: '$(Build.ArtifactStagingDirectory)'\n        ArtifactName: 'webapp'\n\n- stage: Deploy\n  dependsOn: Build\n  jobs:\n  - deployment: DeployToProd\n    environment: 'production'\n    strategy:\n      runOnce:\n        deploy:\n          steps:\n          - download: current\n            artifact: webapp\n          - script: echo "Deploying to production..."`,
      codeLabel: 'Complete CI/CD YAML Pipeline',
      keyPoints: [
        'CI automatically builds and tests code on every commit — providing fast feedback.',
        'CD automatically deploys validated artifacts to environments (dev, test, prod).',
        'Pipeline structure: Trigger → Pool → Stages → Jobs → Steps.',
        'Build once, deploy many — promote the same artifact through environments.'
      ]
    },

    /* ──────────────── 25. Self-Hosted Agents ─────────────────────────── */
    {
      title: 'Self-Hosted Agents',
      image: '/images/azure-devops/self-hosted-agent.svg',
      content:
`**Agents** are the machines that execute your pipeline jobs. Azure DevOps offers two types: **Microsoft-hosted** and **Self-hosted** agents.

### Microsoft-hosted Agents

These are **disposable VMs managed by Microsoft** that provide a clean environment for every run. They support Linux, Windows, and macOS and come pre-installed with common tools. They are the easiest option to start with — no setup required.

### Self-hosted Agents

Self-hosted agents run on **your own machine, VM, or on-premises server**. They are useful when your build depends on **custom software, private network access, specific hardware**, or internal deployment targets that hosted agents cannot reach.

### Step-by-Step Setup (Windows)

**Step 1 — Create a Personal Access Token (PAT):** Go to your Azure DevOps profile → *Personal access tokens* → *New Token*. Set the scope to **Agent Pools (read, manage)** and copy the token.

**Step 2 — Create an Agent Pool:** In Azure DevOps → *Project Settings* → *Agent pools* → *Add pool*. Choose **Self-hosted**, give it a name (e.g., "MyLocalPool"), and save.

**Step 3 — Download the Agent:** Go to the pool → *Agents* tab → *New agent* → Select Windows → Download. Extract the ZIP to a folder (e.g., \`C:\\agents\`).

**Step 4 — Configure the Agent:** Open an elevated PowerShell, navigate to the agent folder, and run \`.\\config.cmd\`. You will be prompted for: **Server URL:** \`https://dev.azure.com/your-organization\`, **Authentication:** PAT, **Agent pool name**, **Agent name**, **Run as service:** Yes (recommended).

**Step 5 — Start the Agent:** If configured as a service, it starts automatically on boot. Otherwise, run \`.\\run.cmd\`. Verify in Azure DevOps → *Agent pools* → your pool → *Agents* tab — the agent should show as **Online**.

### Using in a Pipeline

To use your self-hosted agent, replace the pool configuration in your YAML:`,
      code: `# Step 1: Navigate to agent folder and configure\nC:\\agents\n.\\config.cmd\n\n# During setup, provide:\n# Server URL: https://dev.azure.com/your-organization\n# Authentication: PAT\n# Agent pool name: MyLocalPool\n# Agent name: MyLocalMachineAgent\n# Run as service: Y\n\n# Step 2: Start the agent (if not running as service)\n.\\run.cmd\n\n# Step 3: Use in YAML pipeline\npool:\n  name: MyLocalPool   # Use your self-hosted pool\n\n# For Linux: download Linux package, use ./config.sh\n# Same PAT and pool steps apply`,
      codeLabel: 'Self-hosted Agent Setup',
      keyPoints: [
        'Microsoft-hosted agents are managed by Azure — clean, disposable, zero setup.',
        'Self-hosted agents run on your own machine — needed for custom tools or private network access.',
        'Setup requires a PAT, agent pool, downloaded agent package, and config.cmd (Windows) or config.sh (Linux).',
        'Self-hosted agents give more control but require maintenance, patching, and security management.'
      ]
    },

    /* ──────────────── 26. Variables & Variable Groups ────────────────── */
    {
      title: 'Variables & Variable Groups',
      image: '/images/azure-devops/variable-precedence.svg',
      content:
`Variables allow you to store configuration values and secrets that your pipelines need. Azure DevOps supports variables at multiple levels with a clear **precedence hierarchy**.

### Where to Define Variables

**In YAML file** (recommended for code-as-config) — defined inline in the pipeline YAML. **In Pipeline UI** — *Pipelines → your pipeline → Edit → Variables tab*. **At queue time** — when you manually queue a run, you can override or add variables.

### Variable Groups

A **Variable Group** is a *reusable collection of variables and secrets* that can be shared across multiple pipelines. They are ideal for environment-specific configuration (database connection strings, API keys, feature flags).

### Creating a Variable Group

In Azure DevOps → *Pipelines* → **Library** → **+ Variable group** → give it a name (e.g., "ProdSecrets") → add variables. For sensitive values, click the **lock icon** to mark them as secrets (values are hidden and masked in logs). Optionally, you can **link to Azure Key Vault** to pull secrets directly from a vault — select your Azure service connection and key vault.

### Using Variable Groups in YAML

Reference variable groups in your pipeline YAML using the \`group\` keyword. You can link multiple groups and override specific variables inline.

### Precedence Rules (Highest to Lowest)

**1. Queue-time variables** — highest priority, set when manually queuing a run. **2. Job-level YAML variables** — override stage-level variables. **3. Stage-level YAML variables** — override root-level variables. **4. Root-level YAML variables** — override Pipeline Settings UI variables. **5. Variable groups** — lowest priority.

If multiple groups are linked, the **last group** in the YAML list wins on name conflicts. Secrets from variable groups are automatically **masked in logs** unless explicitly mapped with \`env:\` in tasks.`,
      code: `# Define variables in YAML\nvariables:\n- group: ProdSecrets          # Link a variable group\n- group: AnotherGroup\n- name: environmentName\n  value: 'production'\n\nstages:\n- stage: Deploy\n  variables:\n    connectionName: 'prod-service-connection'  # Stage-level\n  jobs:\n  - job: DeployApp\n    variables:\n      slotName: 'blue'                         # Job-level\n    steps:\n    - script: echo Deploying $(environmentName) to $(slotName)\n      displayName: 'Deploy to $(connectionName)'`,
      codeLabel: 'Variables & Variable Groups',
      keyPoints: [
        'Define variables in YAML, Pipeline UI, or at queue time — each has different precedence.',
        'Variable Groups are reusable collections shared across pipelines — ideal for secrets.',
        'Precedence order: Queue-time > Job-level > Stage-level > Root YAML > Variable Groups.',
        'Store secrets in variable groups or Azure Key Vault — never in source control.'
      ]
    },

    /* ──────────────── 27. Deploying ARM Templates via Pipelines ─────── */
    {
      title: 'Deploying ARM Templates via Pipelines',
      image: '/images/azure-devops/iac-pipeline.svg',
      content:
`One of the most powerful Azure DevOps use cases is deploying **Infrastructure as Code** through CI/CD pipelines. Instead of manually creating resources in the Azure Portal, you define infrastructure in **ARM templates** and deploy them automatically.

### Prerequisites

**A Git repository** in Azure DevOps containing your ARM template files (\`azuredeploy.json\` and \`azuredeploy.parameters.json\`). **An Azure Resource Manager service connection** — go to *Project Settings → Service Connections → New → Azure Resource Manager*. Use **Workload Identity Federation** (recommended, no secrets) or **Service Principal**.

### Repository Structure

Organize your ARM files in a dedicated folder:
\`templates/azuredeploy.json\` — The main template. \`templates/azuredeploy.parameters.json\` — Environment-specific parameter values.

### The Deployment Task

Use the **\`AzureResourceManagerTemplateDeployment@3\`** task in your YAML pipeline. This task reads your template, connects to Azure via the service connection, and creates or updates resources as defined.

### Multi-Environment Deployments

For multi-stage pipelines (Dev → Test → Prod), place the deployment task inside a **stage** and use **different variable groups** per environment. This lets you deploy the same template with environment-specific parameters (different resource names, sizes, regions).

### Validation Before Deployment

Add a validation step before deployment. Use tools like **ARM Template Test Toolkit (arm-ttk)** to test templates for correctness and best practices before deploying to any environment.`,
      code: `trigger:\n- main\n\npool:\n  vmImage: 'ubuntu-latest'\n\nvariables:\n- group: MyVariableGroup\n\nsteps:\n- task: AzureResourceManagerTemplateDeployment@3\n  displayName: 'Deploy ARM Template'\n  inputs:\n    deploymentScope: 'Resource Group'\n    azureResourceManagerConnection: 'MyAzureSC'\n    subscriptionId: '$(subscriptionId)'\n    action: 'Create Or Update Resource Group'\n    resourceGroupName: 'MyResourceGroup'\n    location: 'westeurope'\n    templateLocation: 'Linked artifact'\n    csmFile: '$(Build.SourcesDirectory)/templates/azuredeploy.json'\n    csmParametersFile: '$(Build.SourcesDirectory)/templates/azuredeploy.parameters.json'\n    deploymentMode: 'Incremental'`,
      codeLabel: 'ARM Deployment Pipeline',
      keyPoints: [
        'Keep ARM templates in Git alongside your application code.',
        'Use a service connection (not manual credentials) for Azure authentication.',
        'AzureResourceManagerTemplateDeployment@3 is the standard task for ARM deployments.',
        'Use multi-stage pipelines with different variable groups for Dev, Test, and Prod environments.'
      ]
    },

    /* ──────────────── 28. Terraform with Azure DevOps ────────────────── */
    {
      title: 'Terraform with Azure DevOps',
      content:
`**Terraform** is a popular open-source **Infrastructure as Code (IaC)** tool by HashiCorp. Unlike ARM templates (Azure-only), Terraform can manage infrastructure across *multiple cloud providers* (Azure, AWS, GCP) using a consistent configuration language called **HCL (HashiCorp Configuration Language)**.

### Why Terraform?

Everything is **version-controlled in Git**, making changes reviewable via pull requests. It provides **consistent environments** — no "it works on my machine" problems. It supports **multi-cloud** infrastructure management. It has a large community and rich ecosystem of **providers**.

### Installation

Download Terraform from [https://developer.hashicorp.com/terraform/install](https://developer.hashicorp.com/terraform/install). Extract the binary and add it to your system **PATH**. Verify with: \`terraform --version\`.

### Project Structure

A typical Terraform project has these files: **\`provider.tf\`** — Defines which providers to use (e.g., Azure DevOps, Azure RM). **\`variables.tf\`** — Declares input variables. **\`terraform.tfvars\`** — Sets variable values (environment-specific). **\`main.tf\`** — Defines the actual resources to create.

### Core Commands

**\`terraform init\`** — Initialize the project and download providers (run once). **\`terraform plan\`** — Preview what will be created, changed, or destroyed. **\`terraform apply\`** — Execute the plan and create/update resources. **\`terraform show\`** — Display current state of managed resources. **\`terraform destroy\`** — Delete all managed resources (use carefully!).

### Best Practices

Keep Terraform code in a **separate repository** (e.g., \`devops-infra\`). Always review \`terraform plan\` output before applying. Use **variables** instead of hardcoding values. **Never** run \`terraform apply\` from your local machine in production — use pipelines. Commit \`.tf\` files to Git but **never** commit \`.tfstate\` files (they contain sensitive data).`,
      code: `# provider.tf\nterraform {\n  required_version = ">= 1.3.0"\n  required_providers {\n    azuredevops = {\n      source  = "microsoft/azuredevops"\n      version = ">= 0.1.0"\n    }\n  }\n}\nprovider "azuredevops" {}\n\n# main.tf\nresource "azuredevops_project" "project" {\n  name               = var.project_name\n  description        = "Managed by Terraform"\n  visibility         = "private"\n  work_item_template = "Agile"\n}\n\nresource "azuredevops_git_repository" "repo" {\n  project_id = azuredevops_project.project.id\n  name       = var.repo_name\n  initialization {\n    init_type = "Clean"\n  }\n}\n\n# Pipeline YAML for Terraform\ntrigger:\n- main\n\nsteps:\n- task: TerraformInstaller@0\n  inputs:\n    terraformVersion: '1.14.0'\n- task: TerraformTask@5\n  inputs:\n    command: 'init'\n- task: TerraformTask@5\n  inputs:\n    command: 'plan'\n    commandOptions: '-out=tfplan'\n- task: TerraformTask@5\n  inputs:\n    command: 'apply'\n    commandOptions: 'tfplan'\n  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))`,
      codeLabel: 'Terraform Configuration & Pipeline',
      keyPoints: [
        'Terraform is a multi-cloud IaC tool using HCL — not limited to Azure.',
        'Core workflow: init (setup) → plan (preview) → apply (execute).',
        'Always review terraform plan output before applying changes.',
        'Run terraform apply through pipelines in production — never from local machines.'
      ]
    },

    /* ──────────────── 29. Docker Fundamentals ────────────────────────── */
    {
      title: 'Docker Fundamentals',
      image: '/images/azure-devops/docker-architecture.svg',
      content:
`**Docker** is the most popular *containerization platform* in the industry. It packages an application and all its dependencies into a single unit called a **container**, ensuring the application runs consistently across any environment.

### Why Docker?

**Consistency** — Applications run the same way in development, testing, and production. No more "it works on my machine" issues. **Isolation** — Each container runs in its own environment, preventing conflicts between applications. **Efficiency** — Containers are lightweight and start in seconds (unlike VMs which take minutes). **Scalability** — Run multiple container instances to handle increased load.

### Key Concepts

**Docker Image** — An *immutable template* that contains the application code, runtime, libraries, and dependencies. Images are built from a \`Dockerfile\`. **Docker Container** — A *running instance* of an image. Containers are isolated, portable, and ephemeral. **Dockerfile** — A text file with instructions for building an image. **Docker Hub / Registry** — A repository for storing and sharing Docker images. Azure has its own registry called **Azure Container Registry (ACR)**.

### Dockerfile Example

A Dockerfile typically contains: **\`FROM\`** — The base image to start from (e.g., \`node:18-alpine\`). **\`WORKDIR\`** — Sets the working directory inside the container. **\`COPY\`** — Copies files from your machine into the container. **\`RUN\`** — Executes commands during image build (e.g., install dependencies). **\`EXPOSE\`** — Documents which port the container listens on. **\`CMD\`** — The command to run when the container starts.

### Docker in Azure DevOps

Docker is commonly used in CI/CD pipelines to: **build** the application image, **tag** it with the commit SHA or version number, **push** it to a registry (Docker Hub or ACR), and **deploy** the containerized application to Azure App Service, AKS, or other container hosts.`,
      code: `# Dockerfile example\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]\n\n# Build an image\ndocker build -t myapp:latest .\n\n# Run a container\ndocker run -d -p 3000:3000 myapp:latest\n\n# List running containers\ndocker ps\n\n# View logs\ndocker logs <container_id>\n\n# Stop a container\ndocker stop <container_id>\n\n# Push to a registry\ndocker tag myapp:latest myregistry.azurecr.io/myapp:latest\ndocker push myregistry.azurecr.io/myapp:latest`,
      codeLabel: 'Docker Commands & Dockerfile',
      keyPoints: [
        'Docker packages applications into portable, isolated containers for consistent deployment.',
        'Images are immutable templates; Containers are running instances of images.',
        'Dockerfile defines how to build an image: FROM, WORKDIR, COPY, RUN, EXPOSE, CMD.',
        'In Azure DevOps pipelines, Docker is used to build, tag, push, and deploy container images.'
      ]
    },

    /* ──────────────── 30. Best Practices & Learning Path ────────────── */
    {
      title: 'Best Practices & Learning Path',
      content:
`Learning Azure and Azure DevOps can feel overwhelming due to the breadth of topics. Here is a **structured learning path** and a set of best practices to guide your journey as a beginner.

### Recommended Learning Order

**Phase 1 — Azure Fundamentals:** Understand accounts, subscriptions, resource groups, and the Azure Portal. Create a storage account and a simple virtual machine. Learn basic PowerShell and Azure CLI commands.

**Phase 2 — Networking & Security:** Set up a Virtual Network with subnets. Understand NICs, NSGs, and IP addressing. Secure resources with firewall rules and access control.

**Phase 3 — Application Deployment:** Create a .NET application using the CLI. Understand IaaS vs PaaS vs SaaS. Deploy your app to Azure App Service. Learn about scaling strategies.

**Phase 4 — Infrastructure as Code:** Write and deploy ARM templates. Learn Terraform basics. Understand resource providers and types.

**Phase 5 — Azure DevOps:** Create a project with Azure Repos and Boards. Set up branch policies and pull request workflows. Write YAML pipelines for CI/CD. Configure variables, secrets, and environments. Deploy infrastructure through pipelines.

**Phase 6 — Containers & Advanced Topics:** Learn Docker fundamentals. Build and push container images in pipelines. Explore self-hosted agents and advanced pipeline features.

### DevOps Best Practices

**Keep pipeline logic in YAML** — Version-controlled pipelines are reviewable and repeatable. **Keep secrets out of code** — Use Azure Key Vault or Variable Groups for sensitive data. **Use small pull requests** — Easier to review, fewer merge conflicts, faster feedback. **Make builds mandatory** — Require CI validation to pass before merging to protected branches. **Automate everything repetitive** — If you do it more than twice, script it. **Tag and version your releases** — Use semantic versioning for clear release tracking.

### Resources for Continued Learning

[Microsoft Learn — Azure Fundamentals](https://learn.microsoft.com/en-us/training/paths/az-900-describe-cloud-concepts/) — Free, structured learning paths with hands-on labs. [Azure DevOps Documentation](https://learn.microsoft.com/en-us/azure/devops/) — Official comprehensive documentation. [Terraform Azure Provider Docs](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs) — Reference for Terraform with Azure.`,
      keyPoints: [
        'Follow a structured path: Azure Fundamentals → Networking → App Deployment → IaC → DevOps → Docker.',
        'Keep pipeline logic in YAML, secrets in Key Vault, and pull requests small.',
        'Require CI validation builds on protected branches — this prevents broken code from merging.',
        'Automate anything repetitive and use semantic versioning for releases.'
      ]
    }
  ]
};
