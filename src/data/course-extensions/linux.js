/*
 * Linux course extension — extra sections and worked examples merged into
 * courses-data/linux.js at load time. Commands target Ubuntu/Debian and
 * RHEL-family systems with bash; differences are noted inline.
 */

export default {
  examples: {
    'The Linux Command Line': [
      {
        title: 'Navigation and file basics in one session',
        language: 'bash',
        code: `pwd                              # where am I?
mkdir -p ~/lab/project/{src,logs} && cd ~/lab/project
touch src/app.py logs/app.log
ls -lah                          # long list, all files, human sizes
tree -L 2 2>/dev/null || find . -maxdepth 2
cp src/app.py src/app.bak.py
mv src/app.bak.py /tmp/
echo "hello" > notes.txt         # overwrite
echo "world" >> notes.txt        # append
cat notes.txt; wc -l notes.txt
cd -                             # back to the previous directory
history | tail -5                # recent commands (!! repeats the last one)`,
      },
    ],
    'Deploying Applications': [
      {
        title: 'Zero-downtime-ish deploy script with releases + symlink',
        language: 'bash',
        explanation: 'Each deploy goes into a timestamped release folder; `current` is an atomic symlink switch, so rolling back is just pointing it at the previous release.',
        code: `#!/usr/bin/env bash
set -euo pipefail

APP=/srv/myapp
RELEASE="$APP/releases/$(date +%Y%m%d%H%M%S)"
REPO=https://github.com/acme/myapp.git

git clone --depth 1 --branch main "$REPO" "$RELEASE"
cd "$RELEASE"
python3 -m venv .venv && .venv/bin/pip install -q -r requirements.txt
ln -sfn "$APP/shared/.env" "$RELEASE/.env"

ln -sfn "$RELEASE" "$APP/current.tmp" && mv -Tf "$APP/current.tmp" "$APP/current"   # atomic switch
sudo systemctl restart myapp
curl -fsS --retry 5 --retry-delay 2 http://127.0.0.1:8000/health

ls -1dt "$APP"/releases/* | tail -n +6 | xargs -r rm -rf                           # keep last 5
echo "Deployed $RELEASE"`,
      },
    ],
  },

  sections: [
    {
      title: 'Filesystem Hierarchy & Paths',
      after: 'Linux Fundamentals',
      content: `Everything in Linux lives under a single root \`/\` — disks, USB drives and network shares are **mounted** into that tree.

| Directory | Contains |
|---|---|
| \`/etc\` | system configuration (\`/etc/nginx\`, \`/etc/ssh/sshd_config\`) |
| \`/home/<user>\` | user home directories (\`~\`) |
| \`/root\` | the root user's home |
| \`/var\` | variable data: \`/var/log\`, \`/var/lib\` (databases), \`/var/www\` |
| \`/usr\` | installed software: \`/usr/bin\`, \`/usr/lib\`, \`/usr/local\` (your own builds) |
| \`/opt\` | self-contained third-party apps |
| \`/tmp\` | temporary files (often cleared on reboot) |
| \`/dev\`, \`/proc\`, \`/sys\` | devices and kernel/process information as files |
| \`/srv\` | data served by this system |
| \`/mnt\`, \`/media\` | mount points |

### Paths

- **Absolute**: starts at \`/\` → \`/var/log/syslog\`
- **Relative**: from the current directory → \`../logs/app.log\`
- \`.\` current, \`..\` parent, \`~\` home, \`-\` previous directory (\`cd -\`)
- Names are **case-sensitive**; hidden files start with \`.\`.`,
      code: `cd /var/log && pwd
ls -l /etc | head                  # config files
ls -la ~                           # dotfiles in your home (.bashrc, .ssh)
realpath ../../etc/hostname        # resolve a relative path
readlink -f /usr/bin/python3       # follow symlinks to the real binary
df -hT                             # mounted filesystems, type and usage
lsblk                              # block devices and partitions
cat /proc/cpuinfo | grep -m1 "model name"
cat /proc/meminfo | head -3
which -a python3; type cd          # where a command comes from
echo "$PATH" | tr ':' '\\n'          # directories searched for commands`,
      codeLabel: 'Exploring the filesystem',
      keyPoints: [
        'There is one tree rooted at `/`; devices are mounted into it.',
        'Config lives in `/etc`, logs in `/var/log`, user data in `/home`.',
        '`/proc` and `/sys` expose kernel and process info as files.',
        'Paths are case-sensitive; dotfiles are hidden from plain `ls`.',
      ],
    },
    {
      title: 'Permissions & Ownership',
      after: 'Filesystem Hierarchy & Paths',
      content: `Every file has an **owner**, a **group** and permission bits for **u**ser, **g**roup and **o**thers.

\`\`\`
-rwxr-x---  1 deploy www-data  4096 Oct 25 10:00 deploy.sh
│└┬┘└┬┘└┬┘     owner  group
│ u  g  o
└ type: - file, d directory, l symlink
\`\`\`

| Bit | File | Directory | Octal |
|---|---|---|---|
| \`r\` | read contents | list entries | 4 |
| \`w\` | modify | create/delete entries | 2 |
| \`x\` | execute | enter (\`cd\`) | 1 |

Common modes: \`644\` (files), \`755\` (scripts/dirs), \`600\` (private keys), \`700\` (private dirs), \`640\` (config readable by group).

### Special bits

\`setuid\` (\`4xxx\`), \`setgid\` (\`2xxx\` — on dirs, new files inherit the group), **sticky** (\`1xxx\` — like \`/tmp\`, only owners can delete). \`umask\` sets default permissions for new files. Fine-grained extra rules: ACLs (\`setfacl\`).`,
      code: `touch report.txt deploy.sh
chmod 644 report.txt               # rw-r--r--
chmod u+x,g+x deploy.sh            # symbolic: add execute for user and group
chmod -R g+rwX shared/ 2>/dev/null # X = execute only on dirs/already-executable files
ls -l report.txt deploy.sh
stat -c '%A %a %U:%G %n' report.txt deploy.sh

sudo chown deploy:www-data deploy.sh          # owner and group
sudo chown -R www-data:www-data /var/www/app  # recursively

mkdir -p ~/.ssh && chmod 700 ~/.ssh           # SSH refuses lax permissions
chmod 600 ~/.ssh/id_ed25519 2>/dev/null

sudo mkdir -p /srv/shared && sudo chmod 2775 /srv/shared   # setgid dir: files inherit group
umask                                         # e.g. 0022 → new files 644, dirs 755
find . -type f -perm -o+w                     # world-writable files (security smell)`,
      codeLabel: 'chmod, chown, setgid directories and audits',
      keyPoints: [
        'Permissions are read/write/execute for user, group and others.',
        'Octal digits add up: r=4, w=2, x=1 (e.g. 755, 644, 600).',
        'Execute on a directory means permission to enter it.',
        'Keep secrets at 600 and avoid world-writable files.',
      ],
    },
    {
      title: 'Text Processing: grep, sed, awk & Pipes',
      after: 'The Linux Command Line',
      content: `Unix tools do one thing well and combine through **pipes** (\`|\`), which feed one command's output into the next.

| Tool | Job | Example |
|---|---|---|
| \`grep\` | filter lines by pattern | \`grep -i "error" app.log\` |
| \`cut\` | pick columns | \`cut -d, -f1,3 data.csv\` |
| \`sort\` / \`uniq\` | order, de-duplicate, count | \`sort \\| uniq -c \\| sort -rn\` |
| \`sed\` | stream edit / substitute | \`sed 's/http:/https:/g'\` |
| \`awk\` | field-based processing | \`awk '{sum+=$3} END {print sum}'\` |
| \`tr\` | translate characters | \`tr 'a-z' 'A-Z'\` |
| \`head\` / \`tail\` | first / last lines; \`tail -f\` follows | |
| \`xargs\` | turn input into arguments | \`find . -name '*.tmp' \\| xargs rm\` |
| \`jq\` | JSON processing | \`jq '.items[].name'\` |

### Redirection

\`>\` overwrite, \`>>\` append, \`2>\` stderr, \`&>\` both, \`2>&1\` merge stderr into stdout, \`< file\` stdin, \`tee\` write and pass through.`,
      code: `cat > access.log <<'EOF'
192.168.1.10 - - [25/Oct/2026:10:00:01] "GET /api/users HTTP/1.1" 200 512 0.031
192.168.1.11 - - [25/Oct/2026:10:00:02] "POST /api/login HTTP/1.1" 401 64 0.120
192.168.1.10 - - [25/Oct/2026:10:00:03] "GET /api/orders HTTP/1.1" 500 128 1.402
192.168.1.12 - - [25/Oct/2026:10:00:04] "GET /api/users HTTP/1.1" 200 498 0.028
192.168.1.10 - - [25/Oct/2026:10:00:05] "GET /api/orders HTTP/1.1" 200 2048 0.250
EOF

echo "== requests per IP"
cut -d' ' -f1 access.log | sort | uniq -c | sort -rn

echo "== errors (status >= 400)"
awk '$8 >= 400 {print $8, $6}' access.log          # $8 = status, $6 = path

echo "== average and max response time"
awk '{sum += $NF; if ($NF > max) max = $NF} END {printf "avg=%.3fs max=%.3fs\\n", sum/NR, max}' access.log

echo "== top endpoints"
grep -oE '"(GET|POST) [^ ]+' access.log | cut -d' ' -f2 | sort | uniq -c | sort -rn | head -3

echo "== anonymise IPs with sed"
sed -E 's/^([0-9]+\\.[0-9]+)\\.[0-9]+\\.[0-9]+/\\1.x.x/' access.log | head -2

echo "== slow requests to a file, still shown on screen"
awk '$NF > 0.2' access.log | tee slow.log | wc -l`,
      codeLabel: 'Analysing an access log with a pipeline',
      keyPoints: [
        'Pipes chain small tools into powerful one-liners.',
        '`sort | uniq -c | sort -rn` is the classic "count and rank" idiom.',
        '`awk` works on whitespace-separated fields: `$1`, `$NF`, `NR`.',
        'Use `tee` to save intermediate output while continuing the pipeline.',
      ],
    },
    {
      title: 'Users, Groups & sudo',
      after: 'Text Processing: grep, sed, awk & Pipes',
      content: `Linux is multi-user. Each process runs as a user, which determines what it may access.

| File | Holds |
|---|---|
| \`/etc/passwd\` | accounts (name, UID, home, shell) |
| \`/etc/shadow\` | password hashes (root-only) |
| \`/etc/group\` | groups and members |
| \`/etc/sudoers\` + \`/etc/sudoers.d/\` | who may run what as root (edit with \`visudo\`) |

### Principles

- Log in as a normal user; use \`sudo\` for admin tasks — avoid working as root.
- Run services under dedicated **system users** without login shells (\`--system --shell /usr/sbin/nologin\`).
- Grant access via **groups** (\`docker\`, \`www-data\`, \`sudo\`/\`wheel\`) rather than per-user permissions.
- Group changes apply at next login (or \`newgrp\`).`,
      code: `id                                        # your uid, gid and groups
whoami; groups

sudo adduser alice                        # Debian/Ubuntu interactive (useradd -m on RHEL)
sudo usermod -aG sudo alice               # add to admin group (wheel on RHEL) — -a = append!
sudo passwd -l alice                      # lock the password (SSH keys still work)

# Service account: no home login, no shell
sudo useradd --system --no-create-home --shell /usr/sbin/nologin myapp
sudo chown -R myapp:myapp /srv/myapp

# Least-privilege sudo rule: deploy may only restart one service
echo 'deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp' | \\
  sudo tee /etc/sudoers.d/deploy >/dev/null
sudo chmod 440 /etc/sudoers.d/deploy
sudo visudo -c                            # validate sudoers syntax

sudo -u myapp whoami                      # run a command as another user
sudo -l                                   # what am I allowed to sudo?
last -n 5; who                            # recent and current logins`,
      codeLabel: 'Accounts, service users and scoped sudo rules',
      keyPoints: [
        'Use a normal account plus `sudo`; avoid logging in as root.',
        'Run each service as its own unprivileged system user.',
        'Always use `usermod -aG` (append) when adding groups.',
        'Scope sudo rules to specific commands and validate with `visudo -c`.',
      ],
    },
    {
      title: 'Package Management',
      after: 'Users, Groups & sudo',
      content: `Distributions ship software as packages with dependency resolution and signed repositories.

| Task | Debian / Ubuntu (\`apt\`) | RHEL / Fedora / Rocky (\`dnf\`) |
|---|---|---|
| Refresh index | \`apt update\` | \`dnf check-update\` |
| Upgrade all | \`apt upgrade\` | \`dnf upgrade\` |
| Install / remove | \`apt install nginx\` / \`apt remove\` | \`dnf install nginx\` / \`dnf remove\` |
| Search | \`apt search redis\` | \`dnf search redis\` |
| Info | \`apt show nginx\` | \`dnf info nginx\` |
| Which package owns a file | \`dpkg -S /usr/bin/curl\` | \`rpm -qf /usr/bin/curl\` |
| List installed | \`apt list --installed\` | \`dnf list installed\` |
| Clean up | \`apt autoremove\` | \`dnf autoremove\` |

Other channels: **snap** / **flatpak** (sandboxed apps), language managers (\`pip\`, \`npm\`), and vendor repos (add their GPG key + source list). Enable **unattended security updates** on servers.`,
      code: `# Debian/Ubuntu
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx curl jq htop unzip
apt-cache policy nginx                       # installed vs candidate version
sudo apt-mark hold nginx                     # pin a version during an incident

# Add a vendor repository the modern way (signed-by keyring)
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \\
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \\
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \\
  sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update && sudo apt install -y docker-ce

# Automatic security patches
sudo apt install -y unattended-upgrades && sudo dpkg-reconfigure -plow unattended-upgrades

# RHEL family equivalents
sudo dnf install -y nginx && sudo dnf upgrade --security -y
rpm -qa | grep -i openssl`,
      codeLabel: 'apt and dnf in practice',
      keyPoints: [
        'Use the distro package manager for system software — it tracks dependencies and updates.',
        'Run `apt update` before installing to refresh package lists.',
        'Add third-party repos with a dedicated signed keyring.',
        'Turn on unattended security updates for servers.',
      ],
    },
    {
      title: 'systemd Services & Logs',
      after: 'System & Process Management',
      content: `**systemd** starts and supervises services on almost every modern distro. A **unit file** describes how to run a program.

| Command | Purpose |
|---|---|
| \`systemctl status nginx\` | state, PID, recent logs |
| \`systemctl start / stop / restart / reload\` | control now |
| \`systemctl enable --now\` | start at boot and now |
| \`systemctl daemon-reload\` | after editing unit files |
| \`systemctl list-units --failed\` | what is broken |
| \`journalctl -u myapp -f\` | follow a service's logs |
| \`journalctl -p err --since "1 hour ago"\` | filter by priority/time |
| \`systemctl list-timers\` | scheduled timers (cron alternative) |

### Unit file essentials

\`Restart=on-failure\` restarts crashed services, \`User=\` drops root, \`EnvironmentFile=\` loads secrets, and hardening options (\`NoNewPrivileges\`, \`ProtectSystem\`) sandbox the process.`,
      code: `# /etc/systemd/system/myapp.service
sudo tee /etc/systemd/system/myapp.service >/dev/null <<'EOF'
[Unit]
Description=My Python API
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=myapp
Group=myapp
WorkingDirectory=/srv/myapp/current
EnvironmentFile=/srv/myapp/shared/.env
ExecStart=/srv/myapp/current/.venv/bin/gunicorn -w 4 -b 127.0.0.1:8000 app:app
Restart=on-failure
RestartSec=3
# Hardening
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/srv/myapp/shared
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now myapp
systemctl status myapp --no-pager
journalctl -u myapp -n 50 --no-pager          # last 50 lines
journalctl -u myapp -f                        # follow live
systemd-analyze security myapp                # hardening score`,
      codeLabel: 'A hardened service unit',
      keyPoints: [
        'Unit files define how systemd runs, restarts and sandboxes a service.',
        'Run `daemon-reload` after changing unit files.',
        '`enable --now` starts a service immediately and at every boot.',
        'Use `journalctl -u <service>` for logs instead of hunting for files.',
      ],
    },
    {
      title: 'Bash Scripting Essentials',
      after: 'systemd Services & Logs',
      content: `Scripts automate repeatable tasks. Start every script with a **shebang** and **strict mode**.

| Construct | Syntax |
|---|---|
| Strict mode | \`set -euo pipefail\` (exit on error, unset vars, failed pipes) |
| Variables | \`name="ada"\`; use \`"$name"\` — always quote |
| Command substitution | \`now=$(date +%F)\` |
| Arithmetic | \`$(( count + 1 ))\` |
| Conditionals | \`if [[ -f "$file" && $n -gt 3 ]]; then … fi\` |
| Loops | \`for f in *.log; do … done\`, \`while read -r line; do … done < file\` |
| Functions | \`log() { echo "[$(date +%T)] $*"; }\` |
| Arguments | \`$1\`, \`$@\`, \`$#\`, \`\${1:-default}\` |
| Exit codes | \`$?\`, \`exit 1\`, \`cmd || handle_error\` |
| Cleanup | \`trap 'rm -f "$tmp"' EXIT\` |

Run \`shellcheck script.sh\` to catch common bugs. Schedule scripts with **cron** (\`crontab -e\`) or systemd timers.`,
      code: `#!/usr/bin/env bash
# backup.sh — compress a directory, keep the newest N archives
set -euo pipefail

SRC="\${1:-$HOME/lab}"
DEST="\${2:-/tmp/backups}"
KEEP="\${KEEP:-3}"

log() { printf '[%s] %s\\n' "$(date +%T)" "$*"; }
die() { log "ERROR: $*" >&2; exit 1; }

[[ -d "$SRC" ]] || die "source $SRC does not exist"
mkdir -p "$DEST"

tmp=$(mktemp)
trap 'rm -f "$tmp"' EXIT                       # always clean up

archive="$DEST/backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$tmp" -C "$(dirname "$SRC")" "$(basename "$SRC")"
mv "$tmp" "$archive"
log "created $archive ($(du -h "$archive" | cut -f1))"

count=0
for f in $(ls -1t "$DEST"/backup-*.tar.gz); do
  count=$(( count + 1 ))
  if (( count > KEEP )); then
    rm -f -- "$f" && log "removed old $f"
  fi
done
log "kept $(ls -1 "$DEST"/backup-*.tar.gz | wc -l) archive(s)"

# crontab -e  →  run nightly at 02:30, log output:
# 30 2 * * * /usr/local/bin/backup.sh /srv/data /backups >> /var/log/backup.log 2>&1`,
      codeLabel: 'A defensive backup script with rotation',
      keyPoints: [
        'Start scripts with `#!/usr/bin/env bash` and `set -euo pipefail`.',
        'Quote every variable expansion to survive spaces in names.',
        'Use `trap ... EXIT` to clean up temporary files on any exit.',
        'Lint with shellcheck and schedule with cron or systemd timers.',
      ],
    },
    {
      title: 'Networking Commands',
      after: 'Bash Scripting Essentials',
      content: `| Need | Command |
|---|---|
| IP addresses / interfaces | \`ip -br addr\`, \`ip route\` |
| Listening ports and owners | \`ss -tulpn\` (replaces \`netstat\`) |
| DNS lookup | \`dig +short example.com\`, \`resolvectl query\` |
| Reachability | \`ping -c 3 host\`, \`traceroute\` / \`mtr\` |
| Test a TCP port | \`nc -zv host 5432\` |
| HTTP requests | \`curl -I\`, \`curl -v\`, \`curl -w '%{time_total}'\` |
| Firewall | \`ufw\` (Ubuntu), \`firewall-cmd\` (RHEL), \`nft\` |
| Capture traffic | \`tcpdump -i any port 443\` |
| Hostname resolution order | \`/etc/hosts\`, \`/etc/resolv.conf\` |

### Debugging "the app can't connect"

1. Is the service **listening**? (\`ss -tlnp | grep 8000\`)
2. On which **address**? \`127.0.0.1\` is local-only; \`0.0.0.0\` is all interfaces.
3. Does **DNS** resolve? (\`dig\`)
4. Is the **port reachable**? (\`nc -zv\`)
5. Is a **firewall / security group** blocking it?`,
      code: `ip -br addr                                   # interfaces at a glance
ip route | head -3                            # default gateway
sudo ss -tulpn | grep -E ':(22|80|443|5432)\\b' # who listens where

dig +short api.github.com
dig example.com MX +noall +answer

nc -zv db.internal 5432                       # TCP port check
curl -sS -o /dev/null -w 'status=%{http_code} dns=%{time_namelookup}s total=%{time_total}s\\n' https://example.com
curl -v --resolve app.example.com:443:10.0.0.12 https://app.example.com/health   # bypass DNS

# Firewall (Ubuntu ufw)
sudo ufw default deny incoming
sudo ufw allow OpenSSH
sudo ufw allow 443/tcp
sudo ufw enable && sudo ufw status verbose

sudo tcpdump -i any -nn port 5432 -c 20       # watch DB traffic`,
      codeLabel: 'Connectivity troubleshooting toolkit',
      keyPoints: [
        '`ss -tulpn` shows listening ports and the process behind each.',
        'Services bound to 127.0.0.1 are unreachable from other hosts.',
        'Check DNS, port reachability and firewalls in that order.',
        '`curl -w` timing fields reveal where HTTP latency comes from.',
      ],
    },
    {
      title: 'SSH & Secure Remote Access',
      after: 'Networking Commands',
      content: `**SSH** is how you administer remote Linux machines. Use **key-based** authentication and disable passwords.

| Task | Command |
|---|---|
| Generate a key | \`ssh-keygen -t ed25519 -C "you@laptop"\` |
| Install it on a server | \`ssh-copy-id user@host\` |
| Connect | \`ssh user@host\`, \`ssh -p 2222 -i key user@host\` |
| Copy files | \`scp file user@host:/tmp/\`, \`rsync -avz dir/ user@host:/srv/dir/\` |
| Port forward | \`ssh -L 5433:localhost:5432 user@db\` (local DB tunnel) |
| Jump host | \`ssh -J bastion user@private-host\` |
| Agent | \`ssh-add\` + \`ForwardAgent\` only to trusted hosts |

### Harden \`sshd_config\`

\`PasswordAuthentication no\`, \`PermitRootLogin no\`, \`AllowUsers deploy alice\`, then \`sudo systemctl reload ssh\`. Add **fail2ban** to block brute-force attempts. Keep a second session open while changing SSH config so you can't lock yourself out.`,
      code: `ssh-keygen -t ed25519 -C "ada@laptop" -f ~/.ssh/id_ed25519
ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@203.0.113.10

# ~/.ssh/config — short aliases, bastion jumps and keep-alives
cat >> ~/.ssh/config <<'EOF'
Host bastion
    HostName 203.0.113.10
    User deploy
    IdentityFile ~/.ssh/id_ed25519

Host app-*
    User deploy
    ProxyJump bastion
    ServerAliveInterval 30

Host app-1
    HostName 10.0.1.21
EOF
chmod 600 ~/.ssh/config

ssh app-1 'uptime && df -h /'                             # run a remote command
rsync -avz --delete ./dist/ app-1:/srv/myapp/static/       # sync a build
ssh -N -L 5433:localhost:5432 app-1 &                      # tunnel: local 5433 → remote DB

# Server-side hardening (/etc/ssh/sshd_config.d/hardening.conf)
sudo tee /etc/ssh/sshd_config.d/hardening.conf >/dev/null <<'EOF'
PasswordAuthentication no
PermitRootLogin no
KbdInteractiveAuthentication no
AllowUsers deploy
EOF
sudo sshd -t && sudo systemctl reload ssh                  # test config before reloading`,
      codeLabel: 'Keys, ~/.ssh/config, tunnels and sshd hardening',
      keyPoints: [
        'Use ed25519 keys and disable password and root logins.',
        '`~/.ssh/config` aliases make jump hosts and options effortless.',
        'Use `rsync` for efficient, resumable file transfers.',
        'Validate with `sshd -t` and keep a session open while changing SSH.',
      ],
    },
    {
      title: 'Disks, Storage & Archives',
      after: 'SSH & Secure Remote Access',
      content: `"Disk full" is one of the most common production incidents.

| Need | Command |
|---|---|
| Free space per filesystem | \`df -h\` (and \`df -i\` for inodes) |
| What uses space | \`du -sh * \\| sort -h\`, \`ncdu\` |
| Biggest files | \`find / -xdev -type f -size +500M\` |
| Deleted-but-open files | \`lsof +L1\` (space freed only when the process restarts) |
| Block devices | \`lsblk -f\` |
| Mount / persist | \`mount /dev/sdb1 /data\` + \`/etc/fstab\` (use UUID) |
| Archives | \`tar -czf a.tar.gz dir\`, \`tar -xzf a.tar.gz -C /dest\`, \`zip\`/\`unzip\` |
| Log rotation | \`/etc/logrotate.d/<app>\` |

Keep logs under control with **logrotate** and journald limits (\`SystemMaxUse=\` in \`/etc/systemd/journald.conf\`).`,
      code: `df -h /                                        # how full is root?
df -i /                                        # inode exhaustion (many tiny files)
sudo du -xh /var --max-depth=2 2>/dev/null | sort -h | tail -10
sudo find / -xdev -type f -size +200M -exec ls -lh {} + 2>/dev/null | sort -k5 -h | tail
sudo lsof +L1 2>/dev/null | head                # deleted files still held open
sudo journalctl --vacuum-size=500M              # shrink the systemd journal

# Attach and mount a new data disk persistently
lsblk -f
sudo mkfs.ext4 -L data /dev/sdb1
sudo mkdir -p /data
echo 'LABEL=data /data ext4 defaults,noatime 0 2' | sudo tee -a /etc/fstab
sudo mount -a && df -h /data

# Rotate application logs daily, keep 14, compress
sudo tee /etc/logrotate.d/myapp >/dev/null <<'EOF'
/var/log/myapp/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
EOF
sudo logrotate -d /etc/logrotate.d/myapp        # dry run`,
      codeLabel: 'Finding space hogs, mounting disks, rotating logs',
      keyPoints: [
        'Check both space (`df -h`) and inodes (`df -i`).',
        'Deleted files held open by a process still consume space until restart.',
        'Mount by UUID or label in `/etc/fstab` and test with `mount -a`.',
        'Use logrotate and journald limits so logs never fill a disk.',
      ],
    },
  ],
};
