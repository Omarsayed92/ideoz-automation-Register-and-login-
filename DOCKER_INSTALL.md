# Docker Installation Guide

## Windows Installation

1. **Download Docker Desktop for Windows:**
   - Go to https://www.docker.com/products/docker-desktop
   - Download Docker Desktop for Windows
   - Run the installer (Docker Desktop Installer.exe)

2. **Installation Steps:**
   - Follow the installation wizard
   - Enable WSL 2 integration if prompted
   - Restart your computer when installation completes

3. **Verify Installation:**
   ```bash
   docker --version
   docker-compose --version
   ```

4. **Start Docker:**
   - Open Docker Desktop application
   - Wait for Docker to start (green status in system tray)

## Alternative: Install via Chocolatey (if you have it)
```bash
choco install docker-desktop
```

## Alternative: Install via winget
```bash
winget install Docker.DockerDesktop
```

## After Installation
1. Open Command Prompt or PowerShell as Administrator
2. Run: `docker run hello-world` to verify installation
3. If successful, you should see "Hello from Docker!" message

## Troubleshooting
- Ensure virtualization is enabled in BIOS
- Enable WSL 2 feature in Windows
- Run Docker Desktop as Administrator if needed