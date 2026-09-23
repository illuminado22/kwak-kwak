# Prometheus Installation Using Ansible

## CPE 212 - Automating Server Management

This project automates the Prometheus installation procedure described in Seatwork 9.1.

The activity focuses on converting the required Prometheus installation, configuration, service management, and verification operations into an Ansible role.

> Note: Seatwork 9.1 itself asks students to document the manual installation procedure before creating an Ansible role. This repository contains the Ansible automation implementation requested as the next step. It intentionally does not document the manual commands.

---

## 1. Project Objective

The goal is to use Ansible as an Infrastructure as Code (IaC) tool to:

- prepare the target Ubuntu server
- create a dedicated Prometheus system user
- create Prometheus configuration and data directories
- download and extract Prometheus
- install the Prometheus and promtool binaries
- install the Prometheus configuration files
- validate the Prometheus configuration
- create the systemd service
- enable Prometheus at boot
- start Prometheus
- verify that Prometheus is running
- verify port 9090
- verify the readiness endpoint
- verify the installed version
- provide browser access to the Prometheus web interface

---

## 2. Requirements

### Control Node

- Ubuntu
- Ansible installed
- SSH access to the Prometheus server

### Managed Server

- Ubuntu Linux
- Network connectivity from the control node
- A user with sudo privileges
- Internet access for downloading Prometheus

### Software

- Ansible
- Prometheus 3.14.0
- systemd

---

## 3. Folder Structure

```text
prometheus-ansible/
│
├── inventory/
│   └── hosts.ini
│
├── group_vars/
│   └── all.yml
│
├── playbooks/
│   └── prometheus.yml
│
├── roles/
│   └── prometheus/
│       ├── defaults/
│       │   └── main.yml
│       ├── handlers/
│       │   └── main.yml
│       ├── tasks/
│       │   └── main.yml
│       ├── templates/
│       │   └── prometheus.service.j2
│       └── README.md
│
└── README.md
```

---

## 4. How the Project Works

The control node runs the main playbook.

The playbook targets the `prometheus` inventory group and applies the `prometheus` role.

```text
Control Node
     |
     | Ansible / SSH
     v
Prometheus Server
     |
     +-- Prometheus user
     +-- /etc/prometheus
     +-- /var/lib/prometheus
     +-- /usr/local/bin/prometheus
     +-- /usr/local/bin/promtool
     +-- systemd service
     |
     v
Prometheus :9090
```

---

## 5. Configuration

Edit `inventory/hosts.ini` and replace the example IP address and username with the actual target server information.

Example:

```ini
[prometheus]
prometheus-server ansible_host=192.168.56.20 ansible_user=ubuntu
```

The `prometheus` group is referenced by the playbook:

```yaml
hosts: prometheus
```

---

## 6. Variables

The project uses variables so that configuration values do not have to be repeated throughout the role.

Important variables include:

| Variable | Purpose |
|---|---|
| `prometheus_version` | Prometheus version to install |
| `prometheus_user` | Dedicated Linux user |
| `prometheus_group` | Prometheus Linux group |
| `prometheus_config_dir` | Prometheus configuration directory |
| `prometheus_data_dir` | Prometheus data storage directory |
| `prometheus_install_dir` | Location of Prometheus binaries |
| `prometheus_port` | Prometheus web/API port |
| `prometheus_download_url` | Prometheus archive download location |

---

## 7. Role Components

### defaults/main.yml

Contains default values used by the role.

### tasks/main.yml

Contains the installation and verification workflow.

### handlers/main.yml

Contains actions triggered when configuration changes require systemd to reload or Prometheus to restart.

### templates/prometheus.service.j2

Generates the systemd service configuration.

---

## 8. Seatwork 9.1 Task Mapping

| Seatwork Task | Ansible Implementation |
|---|---|
| Task 1 - Prepare the Server | `apt` tasks |
| Task 2 - Create Prometheus User | `user` task |
| Task 3 - Create Prometheus Directories | `file` tasks |
| Task 4 - Download Prometheus | `get_url` and `unarchive` |
| Task 5 - Install Prometheus Binaries | `copy` tasks |
| Task 6 - Install Configuration Files | `copy` tasks |
| Task 7 - Validate Configuration | `command` using `promtool` |
| Task 8 - Create systemd Service | `template` |
| Task 9 - Start and Enable Prometheus | `systemd_service` |
| Task 10 - Verify Prometheus | `command`, `uri`, and `systemd_service` |
| Task 11 - Browser Access | Access the server through port 9090 |

---

## 9. Important Ansible Modules

### ansible.builtin.apt

Manages packages and package repositories on Debian/Ubuntu systems.

Used for:

- updating package information
- upgrading packages
- installing required utilities

### ansible.builtin.user

Manages Linux users.

Used to create the dedicated `prometheus` system account and prevent normal interactive login.

### ansible.builtin.file

Manages files and directories.

Used to create Prometheus directories and assign ownership and permissions.

### ansible.builtin.get_url

Downloads a file from a URL to the managed server.

Used to obtain the Prometheus archive.

### ansible.builtin.unarchive

Extracts an archive.

Used to extract the downloaded Prometheus package.

### ansible.builtin.copy

Copies files or directories.

Used for:

- Prometheus binary
- promtool binary
- prometheus.yml
- consoles
- console_libraries

### ansible.builtin.template

Creates a file from a Jinja2 template.

Used to create:

`/etc/systemd/system/prometheus.service`

### ansible.builtin.systemd_service

Manages systemd services.

Used to:

- reload systemd
- enable Prometheus
- start Prometheus
- restart Prometheus
- inspect service status

### ansible.builtin.command

Runs a command on the managed server.

In this project it is primarily used for verification.

### ansible.builtin.uri

Performs HTTP requests.

Used to test:

- the Prometheus web interface
- the Prometheus readiness endpoint

### ansible.builtin.stat

Obtains information about a file.

Used to verify that the downloaded archive exists.

### ansible.builtin.debug

Displays information during an Ansible run.

Used to show verification results.

---

## 10. Systemd Service

The role creates:

```text
/etc/systemd/system/prometheus.service
```

The important settings are:

### User

Runs Prometheus as the dedicated Prometheus user.

### Group

Runs Prometheus using the Prometheus group.

### ExecStart

Specifies the Prometheus executable and its startup options.

### --config.file

Specifies the Prometheus configuration file.

### --storage.tsdb.path

Specifies where Prometheus stores its time-series data.

### Restart

Controls how systemd handles a failed Prometheus process.

### WantedBy

Associates the service with the normal multi-user boot target so it can start automatically when enabled.

---

## 11. Configuration Validation

Before the service is started, the role validates:

```text
/etc/prometheus/prometheus.yml
```

using `promtool`.

This helps prevent Prometheus from being started with an invalid configuration.

---

## 12. Verification

The role performs the following checks:

1. Prometheus user exists.
2. Required directories exist.
3. Prometheus archive was downloaded.
4. Prometheus archive was extracted.
5. Prometheus binary is installed.
6. promtool binary is installed.
7. Prometheus version is available.
8. promtool version is available.
9. Prometheus configuration files exist.
10. Prometheus configuration passes validation.
11. systemd service exists.
12. Prometheus is enabled.
13. Prometheus is running.
14. Port 9090 is checked.
15. Prometheus is reachable locally.
16. Prometheus readiness endpoint returns successfully.
17. Final service state is checked.

---

## 13. Running the Playbook

From the project root:

```bash
ansible-playbook -i inventory/hosts.ini playbooks/prometheus.yml
```

The playbook should complete without fatal errors.

---

## 14. What a Successful Result Means

A successful deployment should result in:

```text
Prometheus user
       +
Prometheus directories
       +
Prometheus binaries
       +
Prometheus configuration
       +
Valid configuration
       +
systemd service
       +
Running service
       +
Port 9090
       +
Ready endpoint
       =
Working Prometheus installation
```

---

## 15. Browser Access

After the playbook successfully completes, access:

```text
http://<SERVER-IP>:9090
```

Replace `<SERVER-IP>` with the IP address of the Prometheus server.

For example:

```text
http://192.168.56.20:9090
```

The Prometheus web interface should appear.

---

## 16. Important Notes

This implementation is designed for the Ubuntu target described in the Seatwork 9.1 materials.

The seatwork identifies Ubuntu as the control node and does not specify a CentOS target. If a separate requirement asks for the same role to support CentOS, the package-management portion should be extended to handle the appropriate Red Hat-family package manager rather than using Ubuntu-specific package tasks unchanged.

The Prometheus version is defined as a variable so it can be changed without rewriting the role.

---

## 17. Learning Outcome Connection

This project demonstrates how a manual installation workflow can be represented as Infrastructure as Code.

Instead of repeatedly performing installation operations by hand, Ansible describes the desired server state and applies the configuration through a reusable role.

The resulting role can be reused for another Prometheus server by changing the inventory and variables instead of rebuilding the entire installation procedure.

---

## 18. References

- Ansible documentation: Working with playbooks
  https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks.html

- Prometheus documentation:
  https://prometheus.io/docs/

- Prometheus downloads:
  https://prometheus.io/download/

- Prometheus installation documentation:
  https://prometheus.io/docs/prometheus/latest/installation/
