export const linuxCourse = {
  id: 'linux',
  title: 'Linux Administration & Deployment',
  description: 'Master the Linux command line, server management, and application deployment.',
  icon: 'Terminal',
  category: 'DevOps & Cloud',
  sections: [
    {
      title: 'Linux Fundamentals',
      image: '/images/linux/linux-overview.png',
      content: `**Linux** is the backbone of the internet. Most servers, containers, and cloud infrastructures run on Linux distributions like Ubuntu, CentOS, or Debian.\n\n### Why Linux for Developers?\n- **Stability & Performance**: Minimal overhead and high uptime.\n- **Security**: Granular permission systems and robust firewalls.\n- **Automation**: Powerful shell scripting for CI/CD pipelines.\n- **Docker & Kubernetes**: Natively built on Linux primitives (cgroups, namespaces).`,
      keyPoints: [
        'Open-source kernel used in millions of servers.',
        'Essential for DevOps and cloud-native development.',
        'High degree of customization and control.',
        'Standard environment for production workloads.'
      ]
    },
    {
      title: 'The Linux Command Line',
      content: `Mastering the terminal is essential for managing Linux servers.\n\n### 1. File Management\n- \`ls -la\`: List all files with details.\n- \`cd /path\`: Change directory.\n- \`mkdir / rm\`: Create / Delete directories and files.\n- \`cp / mv\`: Copy / Move files.\n\n### 2. Text Processing\n- \`cat / tail / head\`: View file content.\n- \`grep\`: Search text using patterns.\n- \`awk / sed\`: Advanced text manipulation and stream editing.\n\n### 3. Permissions & Ownership\n- \`chmod 755 file\`: Change file permissions.\n- \`chown user:group file\`: Change file ownership.\n- \`sudo\`: Execute commands with administrative privileges.`,
      keyPoints: [
        'The CLI is faster and more powerful than any GUI for server management.',
        'Grep and Sed are essential for log analysis.',
        'Proper permission management (chmod/chown) is critical for security.'
      ]
    },
    {
      title: 'System & Process Management',
      content: `Monitoring system health and managing background services.\n\n### 1. Process Control\n- \`top / htop\`: Real-time system monitoring.\n- \`ps aux\`: List all running processes.\n- \`kill -9 pid\`: Forcefully terminate a process.\n\n### 2. Systemd (Service Control)\n- \`systemctl start/stop/restart service\`: Manage background services.\n- \`systemctl enable service\`: Set service to start on boot.\n- \`journalctl -u service\`: View service logs.\n\n### 3. Networking & Disk\n- \`ip addr\`: Check network interfaces.\n- \`netstat / ss\`: View open ports and active connections.\n- \`df -h / du -sh\`: Check disk space and folder sizes.`,
      keyPoints: [
        'systemd is the standard init system for modern Linux distros.',
        'Always check logs using journalctl when a service fails.',
        'Monitor disk and memory usage to prevent system crashes.'
      ]
    },
    {
      title: 'Deploying Applications',
      content: `How to host modern applications on a Linux server.\n\n### 1. .NET & Java Deployments\n- **.NET Core**: Install the .NET Runtime and use \`systemd\` to keep the DLL running as a service.\n- **Java (Spring Boot)**: Run the JAR file with \`java -jar\` or package it as a system service.\n\n### 2. Reverse Proxy with Nginx\nNginx acts as a front door, handling SSL (via Let's Encrypt) and forwarding traffic to your app (port 8080/5000).\n\n### 3. Containerization\n- **Docker**: Package apps into images for consistent deployments.\n- **Kubernetes**: Orchestrate multiple containers across a cluster.`,
      code: `# systemd service example (/etc/systemd/system/myapp.service)\n[Unit]\nDescription=My .NET Web API\n\n[Service]\nWorkingDirectory=/var/www/myapp\nExecStart=/usr/bin/dotnet /var/www/myapp/MyApp.dll\nRestart=always\nUser=www-data\n\n[Install]\nWantedBy=multi-user.target`,
      codeLabel: 'Systemd Service',
      keyPoints: [
        'Use Nginx as a reverse proxy for security and SSL termination.',
        'Automate deployments using Docker and CI/CD.',
        'Use systemd to ensure your apps automatically restart after failure.'
      ]
    }
  ]
};
