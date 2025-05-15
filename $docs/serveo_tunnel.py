import subprocess
import time
import argparse
import os

def run_serveo(host, port, subdomain):
    command = f"ssh -R {subdomain}.serveo.net:80:{host}:{port} serveo.net"
    while True:
        print(f"Starting Serveo tunnel: {command}")
        process = subprocess.Popen(command, shell=True)
        process.wait()
        print("Serveo tunnel stopped. Restarting in 5 seconds...")
        time.sleep(5)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run a Serveo tunnel with automatic restart.')
    parser.add_argument('--host', type=str, required=True, help='The local host to forward to (e.g., localhost).')
    parser.add_argument('--port', type=int, required=True, help='The local port to forward to.')
    parser.add_argument('--subdomain', type=str, required=True, help='The custom subdomain for Serveo (e.g., myapp).')

    args = parser.parse_args()

    run_serveo(args.host, args.port, args.subdomain)
