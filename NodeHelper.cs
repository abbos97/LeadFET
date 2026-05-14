/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.   */
/*! All Rights Reserved. */
/*! ************************************************************* */
using Microsoft.AspNetCore.SpaServices;
using System.Diagnostics;
using System.Net.NetworkInformation;
using System.Text;

namespace DocumentCompareDemo
{
    public static class NodeHelper
    {
        private static bool PlatformIsWindows => OperatingSystem.IsWindows();

        private static ILogger NodeLogger;


        /// <summary>
        /// configured per <seealso cref="SpaOptions"/> on the <paramref name="spa"/>.
        /// </summary>
        /// <param name="port">Hosting port</param>
        /// <param name="sourcePath">App source path</param>
        public static void UseNpmDevServer(this ISpaBuilder spa, int? port = null, string sourcePath = null)
        {
            // throw error if node.js not installed.
            EnsureNodeJSAlreadyInstalled();

            var hasPort = port.HasValue;
            // Default HostingPort
            if (!hasPort)
                port = 3000;

            spa.Options.DevServerPort = port.Value;

            if (!string.IsNullOrWhiteSpace(sourcePath))
                spa.Options.SourcePath = sourcePath;
            else if (string.IsNullOrWhiteSpace(spa.Options.SourcePath))
                throw new ArgumentNullException("ISpaBuilder.Options.SourcePath", "Must specific Spa Client App path");

            var webHostEnvironment = spa.ApplicationBuilder.ApplicationServices.GetService<IWebHostEnvironment>();
            NodeLogger = spa.ApplicationBuilder.ApplicationServices.GetService<ILoggerFactory>()?.CreateLogger("Node");

            //If user didn't provide a port, let's find the next open port
            if (!hasPort && CheckPortInUsed(spa.Options.DevServerPort))
            {
                port = GetNextAvailablePort(port.Value);
                spa.Options.DevServerPort = port.Value;
            }

            // If port not in used, launch dev server
            if (!CheckPortInUsed(spa.Options.DevServerPort))
            {
                // export dev cert
                var spaFolder = Path.Combine(webHostEnvironment.ContentRootPath, spa.Options.SourcePath);
                if (!Directory.Exists(spaFolder))
                    throw new DirectoryNotFoundException(spaFolder);

                EnsureNodeModuleAlreadyInstalled(spa.Options.SourcePath);

                // launch development server
                RunDevServer(spa.Options.SourcePath, spa.Options.DevServerPort, spa.Options.StartupTimeout);
            }
        }

        private static bool CheckPortInUsed(int port)
            => IPGlobalProperties.GetIPGlobalProperties()
                .GetActiveTcpListeners()
                .Select(x => x.Port)
                .Contains(port);

        private static int GetNextAvailablePort(int startPort)
        {
            var usedPorts = IPGlobalProperties.GetIPGlobalProperties()
                                              .GetActiveTcpListeners()
                                              .Select(x => x.Port)
                                              .ToList();

            int port = startPort;
            while (usedPorts.Contains(port))
            {
                port++;
            }
            return port;
        }

        ///// <summary>
        ///// if 'node_module' not exist than run 'npm install'
        ///// </summary>
        private static void EnsureNodeModuleAlreadyInstalled(string sourcePath)
        {
            var checkDependenciesProcess = Process.Start(new ProcessStartInfo()
            {
                FileName = PlatformIsWindows ? "cmd" : "npm",
                Arguments = $"{(PlatformIsWindows ? "/c npm " : "")}ls",
                WorkingDirectory = sourcePath,
                RedirectStandardError = true,
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                UseShellExecute = false,
            });

            checkDependenciesProcess.WaitForExit();

            if (checkDependenciesProcess.ExitCode != 0)
            {
                NodeLogger?.LogWarning($"Missing or incorrect dependencies detected, running npm install...");

                var installProcess = Process.Start(new ProcessStartInfo()
                {
                    FileName = PlatformIsWindows ? "cmd" : "npm",
                    Arguments = $"{(PlatformIsWindows ? "/c npm " : "")}install",
                    WorkingDirectory = sourcePath,
                    RedirectStandardError = true,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                });

                installProcess.WaitForExit();

                NodeLogger?.LogWarning($"npm install done.");
            }
        }


        /// <summary>
        /// Throw exception if 'node --version' catch error
        /// </summary>
        /// <exception cref="Exception"></exception>
        private static void EnsureNodeJSAlreadyInstalled()
        {
            var ps = Process.Start(new ProcessStartInfo()
            {
                FileName = PlatformIsWindows ? "cmd" : "node",
                Arguments = $"{(PlatformIsWindows ? "/c node " : "")}--version",
                //WorkingDirectory = /*SourcePath*/,
                RedirectStandardError = true,
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                UseShellExecute = false,
            });

            ps.WaitForExit();

            if (ps.ExitCode == 0)
                return;

            throw new Exception("Node.js is required to build and run this project. To continue, please install Node.js from https://nodejs.org/, and then restart your command prompt or IDE.");

        }
        private static void RunDevServer(string sourcePath, int port, TimeSpan timeout)
        {
            var runningPort = $" -- --port {port}";
            var processInfo = new ProcessStartInfo
            {
                FileName = PlatformIsWindows ? "cmd" : "npm",
                Arguments = $"{(PlatformIsWindows ? "/c npm " : "")}run vsstart",
                WorkingDirectory = sourcePath,
                RedirectStandardError = true,
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                UseShellExecute = false,
            };
            var process = Process.Start(processInfo);
            var tcs = new TaskCompletionSource<int>();

            _ = Task.Run(() =>
            {
                try
                {
                    string? line;
                    while ((line = process?.StandardOutput.ReadLine()?.Trim()) != null)
                    {
                        if (!string.IsNullOrEmpty(line))
                        {
                            NodeLogger?.LogInformation(line);
                            if (!tcs.Task.IsCompleted && line.Contains("webpack", StringComparison.OrdinalIgnoreCase) && line.Contains("successfully", StringComparison.OrdinalIgnoreCase))
                            {
                                tcs.SetResult(1);
                            }
                        }
                    }
                }
                catch (EndOfStreamException ex)
                {
                    NodeLogger?.LogError(ex.ToString());
                    tcs.SetException(new InvalidOperationException("'npm run start' failed.", ex));
                }
            });

            _ = Task.Run(() =>
            {
                try
                {
                    string? line;
                    while ((line = process?.StandardError.ReadLine()?.Trim()) != null)
                    {
                        if (line.StartsWith("<i>"))
                        {
                            NodeLogger?.LogInformation(line);
                        }
                        else
                        {
                            NodeLogger?.LogError(line);
                        }
                    }
                }
                catch (EndOfStreamException ex)
                {
                    NodeLogger?.LogError(ex.ToString());
                    tcs.SetException(new InvalidOperationException("'npm run start' failed.", ex));
                }
            });

            if (!tcs.Task.Wait(timeout))
            {
                throw new TimeoutException();
            }
        }
    }
}
