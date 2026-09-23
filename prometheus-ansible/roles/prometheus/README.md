# Prometheus Ansible Role

This role installs and configures Prometheus on an Ubuntu server.

## Scope

The role automates the requirements from Seatwork 9.1:

1. Prepare the server
2. Create the Prometheus user
3. Create Prometheus directories
4. Download and extract Prometheus
5. Install Prometheus and promtool binaries
6. Install Prometheus configuration files
7. Validate the configuration
8. Create the systemd service
9. Enable and start Prometheus
10. Verify the installation

Browser access is verified after the playbook completes using:

`http://<SERVER-IP>:9090`

## Main variables

- `prometheus_version`
- `prometheus_user`
- `prometheus_group`
- `prometheus_config_dir`
- `prometheus_data_dir`
- `prometheus_install_dir`
- `prometheus_port`

## Templates

`prometheus.service.j2` creates the systemd service file used to run Prometheus.
