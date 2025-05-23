# escape=`

#########################
# Stage 1: Build Tools Layer
#########################
FROM mcr.microsoft.com/windows/servercore:ltsc2022 AS buildtools

SHELL ["cmd", "/S", "/C"]

# Install Node.js
RUN curl -o nodejs.msi https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi && `
    start /wait msiexec /i nodejs.msi /quiet /norestart && del nodejs.msi

# Install Python (needed by node-gyp)
RUN curl -o python-installer.exe https://www.python.org/ftp/python/3.12.3/python-3.12.3-amd64.exe && `
    start /wait python-installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0 && del python-installer.exe

# Install Visual Studio Build Tools with C++ workload
RUN curl -SL --output vs_buildtools.exe https://aka.ms/vs/17/release/vs_buildtools.exe && `
    start /w vs_buildtools.exe --quiet --wait --norestart --nocache `
      --installPath "%ProgramFiles(x86)%\Microsoft Visual Studio\2022\BuildTools" `
      --add Microsoft.VisualStudio.Workload.VCTools `
      || IF "%ERRORLEVEL%"=="3010" EXIT 0 && del vs_buildtools.exe

# Set working directory
WORKDIR C:\app

# Copy app source
COPY . .

# Install dependencies and build React
RUN npm install && npm rebuild lightningcss
# Build React app with .env.docker
RUN copy .env.docker .env && npm run build -- --mode docker

# npm run build


#########################
# Stage 2: IIS Runtime Layer: Step 9
#########################
FROM mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2025

SHELL ["cmd", "/S", "/C"]

# Install URL Rewrite module (required for SPA routing)
RUN powershell -Command `
  Invoke-WebRequest -Uri "https://download.microsoft.com/download/1/2/8/128E2E22-C1B9-44A4-BE2A-5859ED1D4592/rewrite_amd64_en-US.msi" -OutFile "rewrite.msi"; `
  Start-Process msiexec.exe -ArgumentList '/i rewrite.msi /quiet /norestart' -Wait; `
  Remove-Item -Force "rewrite.msi"

# Remove default IIS content
RUN powershell -Command "Remove-Item -Path 'C:\inetpub\wwwroot\*' -Recurse -Force -ErrorAction SilentlyContinue"

# Copy built React app from previous stage
COPY --from=buildtools C:\app\dist\ C:\inetpub\wwwroot\

# Expose HTTP
EXPOSE 80

# Start IIS
ENTRYPOINT ["cmd", "/c", "start w3svc && powershell.exe -NoLogo -ExecutionPolicy Bypass"]
