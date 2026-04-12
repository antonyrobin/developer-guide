export const terraformCourse = {
    id: 'terraform', title: 'Terraform', description: 'Infrastructure as Code tool by HashiCorp for provisioning and managing cloud resources across Azure, AWS, GCP, GitHub, and more — declaratively with HCL.',
    officialDocs: 'https://developer.hashicorp.com/terraform/docs', tutorialLink: 'https://developer.hashicorp.com/terraform/tutorials', exerciseLink: null,
    sections: [
      { title: 'What is Terraform', image: '/images/terraform/terraform-overview.svg', content: `**Terraform** is an open-source **Infrastructure as Code (IaC)** tool built by HashiCorp. It allows you to define, provision, and manage infrastructure across multiple cloud providers using a declarative configuration language called **HCL (HashiCorp Configuration Language)**.

### Why Terraform?

| Factor | Benefit |
|---|---|
| **Multi-Cloud** | Single tool for Azure, AWS, GCP, Cloudflare, GitHub, and 3000+ providers |
| **Declarative** | Describe the desired state — Terraform figures out how to get there |
| **Idempotent** | Running \`apply\` multiple times produces the same result |
| **Version Controlled** | Infrastructure changes are tracked in Git like application code |
| **Plan Before Apply** | Preview all changes before they happen — no surprises |
| **State Management** | Tracks real-world resources and detects drift |

### Terraform vs Other Tools

| Feature | Terraform | Ansible | CloudFormation |
|---|---|---|---|
| **Approach** | Declarative | Procedural | Declarative |
| **Multi-Cloud** | ✅ All providers | ✅ Agentless | ❌ AWS only |
| **State** | State file | Stateless | Stack state |
| **Language** | HCL | YAML | JSON/YAML |`, keyPoints: ['Terraform is the industry standard for Infrastructure as Code.', 'Supports 3000+ providers including all major cloud platforms.', 'Declarative HCL syntax — describe the desired state, not steps.', 'Plan, apply, and destroy lifecycle for safe infrastructure changes.', 'State file tracks real-world resources to detect drift.'] },

      { title: 'Installation & Setup', content: `### Download & Install

| Platform | Method |
|---|---|
| **Windows** | \`winget install HashiCorp.Terraform\` or download from [terraform.io/downloads](https://developer.hashicorp.com/terraform/downloads) |
| **macOS** | \`brew install terraform\` |
| **Linux** | \`sudo apt-get install terraform\` (via HashiCorp repo) |
| **Docker** | \`docker run -it hashicorp/terraform:latest\` |

### Verify Installation

\`\`\`powershell
terraform --version
# Terraform v1.9.x

# Enable tab completion (optional)
terraform -install-autocomplete
\`\`\`

### VS Code Setup

Install the **HashiCorp Terraform** extension for:
- Syntax highlighting and auto-completion for \`.tf\` files
- Inline documentation for providers and resources
- Format-on-save with \`terraform fmt\`

### Project Structure

\`\`\`text
project/
├── main.tf           # Primary resource definitions
├── variables.tf      # Input variable declarations
├── outputs.tf        # Output values
├── providers.tf      # Provider configuration
├── terraform.tfvars  # Variable values (git-ignored)
├── backend.tf        # Remote state configuration
└── modules/          # Reusable modules
    └── storage/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
\`\`\``, keyPoints: ['Install via winget, brew, or apt depending on your OS.', 'Use HashiCorp Terraform VS Code extension for productivity.', 'Organize config into main.tf, variables.tf, outputs.tf, and providers.tf.', 'terraform.tfvars holds secrets — always add it to .gitignore.', 'Modules enable reusable infrastructure components.'] },

      { title: 'Terraform Workflow', image: '/images/terraform/terraform-workflow.svg', content: `The Terraform workflow follows four core commands: **init**, **plan**, **apply**, and **destroy**.

### Core Commands

| Command | Purpose |
|---|---|
| \`terraform init\` | Download providers and initialize the working directory |
| \`terraform plan\` | Preview changes without modifying infrastructure |
| \`terraform apply\` | Execute changes to reach the desired state |
| \`terraform destroy\` | Tear down all managed infrastructure |
| \`terraform fmt\` | Format \`.tf\` files to canonical style |
| \`terraform validate\` | Check syntax and configuration validity |

### Workflow Example

\`\`\`powershell
# 1. Initialize (downloads providers, sets up backend)
terraform init

# 2. Preview changes (safe — read-only)
terraform plan

# 3. Apply changes (creates/updates/deletes resources)
terraform apply

# 4. Auto-approve (skip confirmation — use in CI/CD)
terraform apply -auto-approve

# 5. Destroy all resources
terraform destroy
\`\`\`

### State File

Terraform stores the mapping between your config and real infrastructure in \`terraform.tfstate\`. For team workflows, use **remote backends** (Azure Blob, S3, Terraform Cloud) to share state safely.

\`\`\`hcl
# backend.tf — Store state in Azure Blob Storage
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "tfstatestorage"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}
\`\`\``, keyPoints: ['Always run plan before apply to preview changes.', 'init downloads providers and configures the backend.', 'State file tracks real-world resources — never edit it manually.', 'Use remote backends for team collaboration.', 'terraform fmt enforces consistent formatting across the team.'] },

      { title: 'Variables & Outputs', content: `### Variable Types

\`\`\`hcl
# variables.tf

variable "project_name" {
  type        = string
  description = "Name of the project"
  default     = "my-app"
}

variable "environment" {
  type        = string
  description = "Deployment environment"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "instance_count" {
  type    = number
  default = 2
}

variable "enable_monitoring" {
  type    = bool
  default = true
}

variable "tags" {
  type = map(string)
  default = {
    managed_by = "terraform"
  }
}

variable "allowed_ips" {
  type    = list(string)
  default = ["10.0.0.0/8"]
}
\`\`\`

### Setting Variable Values

\`\`\`hcl
# terraform.tfvars (auto-loaded, git-ignored)
project_name   = "billing-api"
environment    = "prod"
instance_count = 3
\`\`\`

\`\`\`powershell
# Command line
terraform apply -var="environment=staging"

# Environment variables
$env:TF_VAR_environment = "prod"
\`\`\`

### Outputs

\`\`\`hcl
# outputs.tf
output "storage_account_url" {
  value       = azurerm_storage_account.main.primary_blob_endpoint
  description = "The URL of the storage account"
}

output "vm_public_ip" {
  value     = azurerm_public_ip.main.ip_address
  sensitive = false
}
\`\`\``, keyPoints: ['Terraform supports string, number, bool, list, map, and object types.', 'Use validation blocks to enforce allowed values.', 'terraform.tfvars is auto-loaded — keep secrets here and git-ignore it.', 'Outputs expose resource attributes for other modules or scripts.', 'Mark outputs as sensitive to hide values in plan/apply output.'] },

      { title: 'Azure Resources', content: `### Azure Provider Setup

\`\`\`hcl
# providers.tf
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.azure_subscription_id
}
\`\`\`

### Resource Group + Storage Account

\`\`\`hcl
resource "azurerm_resource_group" "main" {
  name     = "rg-\${var.project_name}-\${var.environment}"
  location = "East US"
  tags     = var.tags
}

resource "azurerm_storage_account" "main" {
  name                     = "\${var.project_name}storage"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  blob_properties {
    versioning_enabled = true
  }
}
\`\`\`

### Virtual Machine

\`\`\`hcl
resource "azurerm_linux_virtual_machine" "main" {
  name                = "vm-\${var.project_name}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  size                = "Standard_B2s"
  admin_username      = "azureuser"

  network_interface_ids = [azurerm_network_interface.main.id]

  admin_ssh_key {
    username   = "azureuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
}
\`\`\`

### Azure Kubernetes Service (AKS)

\`\`\`hcl
resource "azurerm_kubernetes_cluster" "main" {
  name                = "aks-\${var.project_name}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = var.project_name

  default_node_pool {
    name       = "default"
    node_count = 3
    vm_size    = "Standard_D2_v2"
  }

  identity {
    type = "SystemAssigned"
  }
}
\`\`\``, keyPoints: ['Use azurerm provider for all Azure resources.', 'Resource groups organize related Azure resources.', 'Storage accounts support blob, file, queue, and table storage.', 'Use SSH keys for VM authentication — never passwords.', 'AKS clusters can be provisioned with managed identity.'] },

      { title: 'AWS Resources', content: `### AWS Provider Setup

\`\`\`hcl
provider "aws" {
  region = "us-east-1"
}
\`\`\`

### EC2 Instance

\`\`\`hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"

  tags = {
    Name = "\${var.project_name}-web"
  }

  user_data = <<-EOF
    #!/bin/bash
    sudo apt update && sudo apt install -y nginx
    EOF
}
\`\`\`

### S3 Bucket

\`\`\`hcl
resource "aws_s3_bucket" "assets" {
  bucket = "\${var.project_name}-assets"

  tags = {
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = "Enabled"
  }
}
\`\`\`

### AWS Lambda Function

\`\`\`hcl
resource "aws_lambda_function" "api" {
  function_name = "\${var.project_name}-api"
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  filename      = "lambda.zip"
  role          = aws_iam_role.lambda_exec.arn

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.main.name
    }
  }
}
\`\`\``, keyPoints: ['AWS provider uses region-based configuration.', 'EC2 instances can be bootstrapped with user_data scripts.', 'S3 buckets support versioning for data protection.', 'Lambda functions can be deployed directly from zip files.', 'Always use IAM roles — never hardcode AWS credentials.'] },

      { title: 'GCP Resources', content: `### GCP Provider Setup

\`\`\`hcl
provider "google" {
  project = var.gcp_project_id
  region  = "us-central1"
}
\`\`\`

### Compute Engine VM

\`\`\`hcl
resource "google_compute_instance" "web" {
  name         = "\${var.project_name}-vm"
  machine_type = "e2-micro"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }
}
\`\`\`

### Cloud Storage Bucket

\`\`\`hcl
resource "google_storage_bucket" "assets" {
  name          = "\${var.gcp_project_id}-assets"
  location      = "US"
  force_destroy = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    action { type = "Delete" }
    condition { age = 365 }
  }
}
\`\`\`

### GKE Cluster

\`\`\`hcl
resource "google_container_cluster" "primary" {
  name     = "\${var.project_name}-gke"
  location = "us-central1"

  initial_node_count = 3

  node_config {
    machine_type = "e2-medium"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}
\`\`\``, keyPoints: ['GCP provider requires project ID and region configuration.', 'Compute Engine instances are equivalent to AWS EC2 / Azure VMs.', 'Cloud Storage buckets support lifecycle rules for auto-cleanup.', 'GKE is managed Kubernetes — comparable to AKS and EKS.', 'Use service accounts for GCP authentication in CI/CD.'] },

      { title: 'GitHub Provider', content: `Terraform can manage **GitHub resources** — repositories, teams, branch protections, and actions secrets — as code.

### Provider Setup

\`\`\`hcl
provider "github" {
  token = var.github_token
  owner = "your-org"
}
\`\`\`

### Create Repository

\`\`\`hcl
resource "github_repository" "api" {
  name        = "billing-api"
  description = "Billing API microservice"
  visibility  = "private"

  has_issues   = true
  has_projects = true
  has_wiki     = false

  auto_init             = true
  allow_merge_commit    = false
  allow_squash_merge    = true
  delete_branch_on_merge = true

  template {
    owner      = "your-org"
    repository = "dotnet-template"
  }
}
\`\`\`

### Branch Protection

\`\`\`hcl
resource "github_branch_protection" "main" {
  repository_id = github_repository.api.node_id
  pattern       = "main"

  required_pull_request_reviews {
    required_approving_review_count = 2
    dismiss_stale_reviews           = true
  }

  required_status_checks {
    strict   = true
    contexts = ["build", "test"]
  }

  enforce_admins = true
}
\`\`\`

### Actions Secrets

\`\`\`hcl
resource "github_actions_secret" "db_password" {
  repository      = github_repository.api.name
  secret_name     = "DB_PASSWORD"
  plaintext_value = var.db_password
}
\`\`\``, keyPoints: ['Manage GitHub repositories, teams, and settings as code.', 'Branch protection rules enforce code review policies.', 'Actions secrets are injected securely into CI/CD workflows.', 'Use Terraform to standardize repo creation across an organization.', 'Never commit the GitHub token — use environment variables.'] },

      { title: 'Important Features', content: `### Modules — Reusable Infrastructure

\`\`\`hcl
# modules/storage/main.tf
resource "azurerm_storage_account" "this" {
  name                     = var.storage_name
  resource_group_name      = var.rg_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# main.tf — Using the module
module "project_storage" {
  source       = "./modules/storage"
  storage_name = "billingstore"
  rg_name      = azurerm_resource_group.main.name
  location     = azurerm_resource_group.main.location
}
\`\`\`

### Data Sources — Read Existing Resources

\`\`\`hcl
data "azurerm_resource_group" "existing" {
  name = "rg-existing-resources"
}

# Reference: data.azurerm_resource_group.existing.location
\`\`\`

### Workspaces — Multiple Environments

\`\`\`powershell
terraform workspace new staging
terraform workspace new production
terraform workspace select staging
terraform workspace list
\`\`\`

### Lifecycle Rules

\`\`\`hcl
resource "azurerm_storage_account" "main" {
  # ...
  lifecycle {
    prevent_destroy = true    # Block accidental deletion
    ignore_changes  = [tags]  # Don't overwrite external tag changes
  }
}
\`\`\`

### Import Existing Resources

\`\`\`powershell
# Bring existing infrastructure under Terraform management
terraform import azurerm_resource_group.main /subscriptions/.../resourceGroups/my-rg
\`\`\``, keyPoints: ['Modules are reusable infrastructure building blocks.', 'Data sources read existing resources without managing them.', 'Workspaces enable dev/staging/prod from the same config.', 'Lifecycle rules prevent accidental resource deletion.', 'terraform import brings existing infrastructure under management.'] },

      { title: 'Best Practices', content: `### ✅ Do's

| # | Practice | Reason |
|---|---|---|
| 1 | **Use remote state** | Team collaboration and state locking |
| 2 | **Pin provider versions** | Reproducible builds across environments |
| 3 | **Use modules** | DRY infrastructure — reuse across projects |
| 4 | **Run \`plan\` in CI/CD** | Review changes before applying |
| 5 | **Use variables for secrets** | Never hardcode credentials in \`.tf\` files |
| 6 | **Tag all resources** | Cost tracking and resource organization |
| 7 | **Use \`terraform fmt\`** | Consistent formatting across the team |

### ❌ Don'ts

| # | Anti-pattern | Correct Approach |
|---|---|---|
| 1 | **Hardcode secrets** | Use variables + \`terraform.tfvars\` (git-ignored) |
| 2 | **Edit state manually** | Use \`terraform state mv/rm\` commands |
| 3 | **Skip \`plan\`** | Always review before \`apply\` |
| 4 | **Use \`latest\` versions** | Pin provider and module versions |
| 5 | **One giant \`main.tf\`** | Split into logical files |

### Cloud Deployment

| Cloud | State Backend | Auth Method |
|---|---|---|
| **Azure** | Azure Blob Storage | Service Principal / Managed Identity |
| **AWS** | S3 + DynamoDB (locking) | IAM Role / Access Keys |
| **GCP** | Google Cloud Storage | Service Account Key |
| **Terraform Cloud** | Built-in | API Token |`, keyPoints: ['Use remote state backends for team collaboration.', 'Always pin provider versions for reproducible deployments.', 'Never hardcode secrets in .tf files.', 'Run terraform plan in CI/CD before apply.', 'Tag all resources for cost tracking and organization.'] }
    ]
  };
