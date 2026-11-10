---
title: "Adding a GPU to a 1U Dell PowerEdge R630: Benchmarking the Tesla T4 & Patching Proxmox Telemetry (Part B)"
description: Installing the 16GB Tesla T4 into an R630, verifying 1U passive thermal limits under load, patching native Proxmox UI telemetry, and logging a 1,191% Geekbench compute uplift over the Quadro P400.
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Homelab
date: 2026-11-10
imageComponent:
  type: Proxmox
pinned: true
seoImage:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=Dell+R630+Tesla+T4+Benchmark
---

In [Part A of this homelab series](https://rahuldhole.com/blog/adding-nvidia-gpu-to-dell-r630-poweredge), I conquered my 1U hardware hesitation using an old **Quadro P400 (2 GB)**: disabling the deafening iDRAC NVRAM fan ramp penalty (Event PCI3018), confirming physical air gaps inside Riser 1, compiling the host NVIDIA drivers on Debian Bookworm, and mapping LXC and VM pass-through pipelines.

That testbed run established our baseline. Now, the main event: my **NVIDIA Tesla T4 (16 GB)** arrived from Leboncoin (€529.69 all-in).

This post documents the physical dual-GPU installation in a dense 1U chassis, troubleshooting the server chassis intrusion switch, patching live multi-GPU telemetry directly into the Proxmox VE 8 web dashboard, and benchmarking the T4 against the P400 with full thermal validation.

---

## Hardware Layout: Fitting Two GPUs in a 1U R630

The Dell PowerEdge R630 has two PCIe risers connected to the motherboard:

- **Riser 1 (Left / CPU 1):** Houses Slot 1 (low-profile, PCIe 3.0 x16 mechanical/electrical) and Slot 2 (low-profile, PCIe 3.0 x8).
- **Riser 2 (Right / CPU 2):** Accommodates a full-height, 3/4 length card.

Rather than discarding the P400, I set up a split architecture:

1. **NVIDIA Quadro P400:** Slotted into **Riser 2** (`03:00.0`). Dedicated strictly to lightweight utility workloads, NVENC media transcoding, and lightweight video pipelines.
2. **NVIDIA Tesla T4:** Slotted into **Riser 1, Slot 1** (`82:00.0`). Dedicated exclusively to LLM inference, quantized embeddings, and CUDA compute.

### The Surprise Shutdown: The Chassis Intrusion Switch

After sliding Riser 1 back in with the T4 installed, I powered on the server with the top cover off to inspect fan spin and clearance.

A few seconds into the boot cycle, the machine completely shut down.

Before suspecting a PCIe power short or a blown fuse, check the physical switch: the R630 has a spring-loaded **chassis intrusion microswitch** directly behind the front drive bays. If the top lid is unlatched or removed, the iDRAC detects an open intrusion event. By default, high-security profiles will force an immediate shutdown or refuse auxiliary power delivery to prevent hands-on tampering.

I slid the lid shut, engaged the latch securely, plugged the redundant PSUs back in, and the server booted cleanly.

---

## Verifying the Dual-GPU Bus on the Host

Once Proxmox booted, checking the PCIe tree confirmed both accelerators were recognized across their respective CPU sockets:

```bash
lspci | grep -i nvidia

```

```text
03:00.0 VGA compatible controller: NVIDIA Corporation GP107GL [Quadro P400] (rev a1)
03:00.1 Audio device: NVIDIA Corporation GP107GL High Definition Audio Controller (rev a1)
82:00.0 3D controller: NVIDIA Corporation TU104GL [Tesla T4] (rev a1)

```

Running `nvidia-smi` confirmed that our pre-compiled `535.309.01` DKMS driver instantly bound to both cards without recompilation:

```bash
nvidia-smi

```

```text
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.309.01             Driver Version: 535.309.01   CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|=========================================+======================+======================|
|   0  Quadro P400                    Off | 00000000:03:00.0 Off |                  N/A |
| 34%   33C    P8               N/A / N/A |      1MiB /  2048MiB |      0%      Default |
+-----------------------------------------+----------------------+----------------------+
|   1  Tesla T4                       Off | 00000000:82:00.0 Off |                    0 |
| N/A   36C    P8              10W /  70W |      5MiB / 16384MiB |      0%      Default |
+-----------------------------------------+----------------------+----------------------+

```

Notice:

- **Index 0:** Quadro P400 (PCIe `03:00.0`), idling at 33°C.
- **Index 1:** Tesla T4 (PCIe `82:00.0`), pulling a baseline \~10W and idling at 36°C with passive chassis airflow.

---

## Patching Multi-GPU Telemetry into the Proxmox VE 8 Dashboard

Proxmox VE's native summary view tracks CPU, RAM, and storage, but gives zero visibility into GPU load, memory allocation, or thermals. Navigating to a terminal just to check if an inference model is frying a passive card is tedious.

We can inject dynamic GPU telemetry directly into the Proxmox web dashboard using an idempotent backend script, an API hook in `Nodes.pm`, and a UI injection in `pvemanagerlib.js`.

### Step 1: Create the Host Telemetry Collector

Create `/usr/local/bin/pve-gpu-status`, which queries `nvidia-smi` and outputs clean, parseable JSON:

```bash
cat << 'EOF' > /usr/local/bin/pve-gpu-status
#!/bin/bash
if ! command -v nvidia-smi &> /dev/null; then
    echo "[]"
    exit 0
fi

output=$(nvidia-smi --query-gpu=index,name,utilization.gpu,memory.used,memory.total,temperature.gpu --format=csv,noheader,nounits 2>/dev/null)

if [ -z "$output" ]; then
    echo "[]"
    exit 0
fi

echo "$output" | awk -F', ' '
BEGIN { printf "[" }
{
    if (NR > 1) printf ","
    printf "{\"id\":%s,\"name\":\"%s\",\"gpu_util\":%s,\"mem_used\":%s,\"mem_total\":%s,\"temp\":%s}", $1, $2, $3, $4, $5, $6
}
END { printf "]" }'
EOF

chmod +x /usr/local/bin/pve-gpu-status

```

Test it directly:

```bash
/usr/local/bin/pve-gpu-status

```

*Expected output:*

```json
[{"id":0,"name":"Quadro P400","gpu_util":0,"mem_used":1,"mem_total":2048,"temp":33},{"id":1,"name":"Tesla T4","gpu_util":0,"mem_used":5,"mem_total":16384,"temp":36}]

```

---

### Step 2: Hook the Telemetry into `Nodes.pm` (Idempotent)

We hook our script output into the Proxmox REST API response by modifying `/usr/share/perl5/PVE/API2/Nodes.pm`.

Back up the stock file first:

```bash
cp /usr/share/perl5/PVE/API2/Nodes.pm /usr/share/perl5/PVE/API2/Nodes.pm.stock

```

Apply the idempotent Python patch:

```bash
python3 - << 'EOF'
import re

file_path = "/usr/share/perl5/PVE/API2/Nodes.pm"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

if "gpuinfo" not in content:
    snippet = """\n\n    # NVIDIA GPU Dynamic Telemetry
    eval {
        my $gpu_raw = `/usr/local/bin/pve-gpu-status 2>/dev/null`;
        $res->{gpuinfo} = $gpu_raw ? PVE::Tools::trim($gpu_raw) : '[]';
    };
    $res->{gpuinfo} = '[]' if $@;"""

    content = re.sub(r'(\$res->\{pveversion\}\s*=\s*[^;]+;)', r'\1' + snippet, content, count=1)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Nodes.pm successfully patched.")
else:
    print("Nodes.pm was already patched.")
EOF

```

---

### Step 3: Inject the Widget into `pvemanagerlib.js`

In Proxmox VE 8, the web interface bundle is minified. Instead of fragile shell regexes, we use an automated Python injector targeting the Node Status version items.

Back up the stock JavaScript file:

```bash
cp /usr/share/pve-manager/js/pvemanagerlib.js /usr/share/pve-manager/js/pvemanagerlib.js.stock

```

Apply the widget injection and panel height expansion:

```bash
python3 - << 'EOF'
import re
import sys

file_path = "/usr/share/pve-manager/js/pvemanagerlib.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

if "itemId: 'gpuinfo'" in content or 'itemId: "gpuinfo"' in content:
    print("pvemanagerlib.js already patched.")
    sys.exit(0)

widget = """\t{
\t    itemId: 'gpuinfo',
\t    colspan: 2,
\t    printBar: false,
\t    title: gettext('GPU Telemetry'),
\t    textField: 'gpuinfo',
\t    renderer: function(value) {
\t\tif (!value || value === '[]') {
\t\t    return 'No NVIDIA GPU active';
\t\t}
\t\ttry {
\t\t    let gpus = JSON.parse(value);
\t\t    if (!gpus || gpus.length === 0) return 'No active GPUs';
\t\t    let out = [];
\t\t    gpus.forEach(function(gpu) {
\t\t\tlet memPct = Math.round((gpu.mem_used / gpu.mem_total) * 100);
\t\t\tout.push(
\t\t\t    Ext.String.format(
\t\t\t\t'{0}: Load {1}% | Mem {2}% ({3}/{4}MB) | {5}°C',
\t\t\t\tgpu.name, gpu.gpu_util, memPct, gpu.mem_used, gpu.mem_total, gpu.temp
\t\t\t    )
\t\t\t);
\t\t    });
\t\t    return out.join('<br>');
\t\t} catch (e) {
\t\t    return 'GPU format error';
\t\t}
\t    }
\t},
"""

pattern = r"(\{\s*itemId:\s*['\"](?:pve)?version['\"][\s\S]*?\},)"
if re.search(pattern, content):
    content = re.sub(pattern, r"\1\n" + widget, content, count=1)
    content = re.sub(r'height:\s*300,', 'height: 420,', content, count=1)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("pvemanagerlib.js successfully patched.")
else:
    print("Could not find anchor in pvemanagerlib.js")
    sys.exit(1)
EOF

```

Restart the Proxmox web daemons:

```bash
systemctl restart pvedaemon.service pveproxy.service

```

Perform a hard refresh in your browser (`Ctrl + Shift + R`). The **Node Summary** view will now render real-time statistics for both cards directly inside the dashboard:

```text
GPU Telemetry:  Quadro P400: Load 0% | Mem 0% (1/2048MB) | 33°C
                Tesla T4: Load 0% | Mem 0% (5/16384MB) | 36°C

```

---

## Stress Testing: Geekbench Compute Benchmarks

To formally evaluate the hardware before confirming the escrow order, I ran compute stress tests on both cards using Geekbench 7.1.0 (Linux AVX2) on our Dual Intel Xeon E5-2696 v4 setup.

### 1. The Baseline: Quadro P400

First, running OpenCL on the Pascal-based Quadro P400:

```bash
./geekbench7 --gpu OpenCL --gpu-device-id 1

```

- **Score:** **5,348**
- **Verification Link:** [Geekbench Result #385880](https://browser.geekbench.com/v7/gpu/385880)
- **Thermals:** Peaked at **42°C**, drawing minimal power.

A score of \~5.3k represents the baseline for entry-level Pascal (256 CUDA cores, 2 GB VRAM). It runs basic display and NVENC tasks cleanly, but chokes on modern FP16 matrix math.

---

### 2. The Challenger: Tesla T4 (16 GB)

Next, targeting Device 0 (the Tesla T4) over OpenCL:

```bash
./geekbench7 --gpu OpenCL --gpu-device-id 0

```

While the benchmark ran, I monitored the T4's hardware metrics via terminal and the patched dashboard:

```bash
watch -n 1 nvidia-smi -i 1 --query-gpu=temperature.gpu,power.draw,utilization.gpu,memory.used,memory.total,clocks.current.graphics,clocks.current.memory --format=csv

```

### Thermal Behavior Under Load

The Tesla T4 is a **70W passively cooled** accelerator—it has no fan and relies entirely on chassis airflow. During prolonged compute phases:

- **Power Draw:** Jumped from 10W idle to **65W–69W** sustained.
- **Core Frequency:** Locked at its maximum theoretical boost ceiling of **1,590 MHz**.
- **Memory Frequency:** Sustained **5,000 MHz**.
- **Peak Temperature:** **59°C** (Ambient Paris room temperature: \~13°C).

The T4 is thermal-throttled at 85°C. Reaching a peak of only 59°C under 100% compute load demonstrates that the R630 chassis fan curve (with the iDRAC NVRAM ramp override applied) pulls ample CFM across Riser 1 without thermal throttling.

---

## Head-to-Head Benchmark Results

Here is the direct compute comparison between our two homelab GPUs:

| Benchmark / Metric             | Quadro P400 (Pascal)                                          | Tesla T4 (Turing)                                             | Performance Delta          |
| ------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------- |
| **Official Result Link**       | [Result #385880](https://browser.geekbench.com/v7/gpu/385880) | [Result #385911](https://browser.geekbench.com/v7/gpu/385911) | —                          |
| **Compute Units / CUDA Cores** | 2 / 256                                                       | 40 / 2,560                                                    | **10.0x Cores**            |
| **VRAM & Bus Width**           | 2 GB GDDR5 (64-bit)                                           | 16 GB GDDR6 (256-bit)                                         | **8.0x Capacity**          |
| **Max Clock Frequency**        | 1,252 MHz                                                     | 1,590 MHz                                                     | **+27% Clock Speed**       |
| **Peak Power Under Load**      | \~30 W                                                        | \~69 W                                                        | 2.3x Power                 |
| **Geekbench 7 OpenCL Score**   | **5,348**                                                     | **69,030**                                                    | **+1,191% (12.9x faster)** |
| **Particle Physics**           | 656.1 FPS                                                     | 11,576.7 FPS                                                  | **17.6x faster**           |
| **Horizon Detection**          | 261.0 Mpixels/sec                                             | 3,180.0 Mpixels/sec                                           | **12.2x faster**           |
| **Super Resolution**           | 17.9 Kimages/sec                                              | 193.9 Kimages/sec                                             | **10.8x faster**           |
| **Fluid Simulation**           | 64.7 FPS                                                      | 638.7 FPS                                                     | **9.9x faster**            |
| **Face Tracking**              | 7.06 images/sec                                               | 87.8 images/sec                                               | **12.4x faster**           |

---

## Key Homelab Takeaways

1. **Passive GPUs in 1U Racks Are Viable:** You do not need to strap noisy aftermarket 40mm blower fans onto a Tesla T4 heatsink if you run an enterprise 1U server. The internal fan wall moves sufficient static pressure across Riser 1, keeping a 70W load steady at 59°C.
2. **True Boost Retention:** A score of **69,030** sits above the typical cloud T4 baseline (usually 61k–65k), confirming zero thermal throttling and consistent 1,590 MHz boost retention.
3. **Hardware Confirmed:** The card passed all stress and thermal criteria, confirming the Leboncoin order was safe to finalize.

With 16 GB of high-bandwidth GDDR6, full Turing Tensor Cores, and active Proxmox dashboard telemetry in place, the cluster is ready for modern workloads.

Next up: deploying **Ollama** and **vLLM** inside an unprivileged Proxmox LXC container, configuring INT4/FP16 model offloading, and benchmarking real-world tokens-per-second throughput across 7B and 14B parameter models.

```text
```
