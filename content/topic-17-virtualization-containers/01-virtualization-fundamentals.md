# Virtualization & Containers - Fundamentals

## Quick Reference (TL;DR)

**Virtual Machine**: Complete OS running on virtualized hardware. Hypervisor manages VMs. Type 1 (bare metal) vs Type 2 (hosted).

**Container**: Isolated process environment sharing host kernel. Uses namespaces (isolation) and cgroups (resource limits). Faster than VMs, less isolation.

**Why Containers Faster**: Share kernel (no OS boot), less overhead, faster startup. But weaker isolation (kernel bugs affect all).

**Namespaces**: Isolate resources (PID, network, mount, etc.). Each container has own namespace.

**cgroups**: Control groups. Limit and account for resource usage (CPU, memory, I/O). Per-container limits.

---

## 1. Clear Definition

**Virtualization** allows running multiple operating systems on one physical machine. **Containers** provide lightweight isolation by sharing the host OS kernel.

**Key Difference**: VMs virtualize hardware, Containers virtualize OS.

---

## 2. Core Concepts

### Virtual Machines

**Definition**: Complete OS running on virtualized hardware.

**Components**:
- **Guest OS**: OS running inside VM
- **Hypervisor**: Manages VMs, virtualizes hardware
- **Virtual Hardware**: CPU, memory, disk, network (emulated)

**Types of Hypervisors**:

**Type 1 (Bare Metal)**:
- Runs directly on hardware
- No host OS
- Better performance
- Example: VMware ESXi, Hyper-V, KVM

**Type 2 (Hosted)**:
- Runs on host OS
- Host OS manages hardware
- Easier to use
- Example: VMware Workstation, VirtualBox

**Comparison**:
| Aspect | Type 1 | Type 2 |
|--------|--------|--------|
| **Performance** | Better | Lower |
| **Complexity** | Higher | Lower |
| **Use case** | Servers | Desktop |

### Containers vs VMs

**Containers**:
- **Share kernel**: All containers use host OS kernel
- **Lightweight**: Less overhead
- **Fast startup**: Seconds
- **Less isolation**: Kernel bugs affect all

**Virtual Machines**:
- **Separate kernel**: Each VM has own OS
- **Heavyweight**: More overhead
- **Slow startup**: Minutes
- **Strong isolation**: Kernel bugs isolated per VM

**Visual**:
```
Containers:
App1  App2  App3
  │     │     │
  └─────┼─────┘
        │
    Host Kernel
        │
     Hardware

VMs:
VM1(OS+App)  VM2(OS+App)
     │            │
     └─────┬──────┘
          │
      Hypervisor
          │
       Hardware
```

### Why Containers Are Faster

**Reasons**:

1. **No OS boot**: Share host kernel (no boot time)
2. **Less overhead**: No full OS per container
3. **Shared resources**: Kernel, libraries shared
4. **Direct hardware access**: Through host kernel (faster)

**Comparison**:
- **Container startup**: ~1-5 seconds
- **VM startup**: ~30-300 seconds (OS boot)

**Memory**:
- **Container**: ~10-100 MB overhead
- **VM**: ~500 MB - 2 GB overhead (full OS)

**CPU**:
- **Container**: Minimal overhead
- **VM**: Hypervisor overhead (~5-10%)

### Why Containers Share Kernel

**Architecture**: Containers are processes with isolation, not separate OSes.

**Benefits**:
- **Efficiency**: One kernel for all containers
- **Performance**: Direct system calls (no hypervisor)
- **Resource sharing**: Libraries, kernel code shared

**Trade-off**: Less isolation (kernel bugs affect all containers).

### Why Containers Are Weaker Isolation

**Shared Components**:
- **Kernel**: All containers share same kernel
- **Kernel bugs**: Affect all containers
- **Kernel modules**: Shared across containers

**Contrast with VMs**:
- **Separate kernels**: Each VM has own kernel
- **Kernel bugs**: Isolated per VM
- **Hypervisor**: Additional isolation layer

**Example Attack**:
- **Container escape**: Exploit kernel bug → access host
- **VM escape**: Exploit hypervisor bug → access host (harder)

**When to use**:
- **Containers**: Trusted workloads, same OS
- **VMs**: Untrusted workloads, different OSes, strong isolation

### Namespaces

**Definition**: Linux feature that isolates resources. Each namespace provides isolated view of system.

**Types**:
1. **PID namespace**: Isolated process IDs
2. **Network namespace**: Isolated network stack
3. **Mount namespace**: Isolated file system mounts
4. **UTS namespace**: Isolated hostname
5. **IPC namespace**: Isolated inter-process communication
6. **User namespace**: Isolated user IDs

**Example**:
```bash
# Create new PID namespace
unshare --pid --fork bash
# Now in isolated namespace
# Process IDs start from 1
# Can't see processes in other namespaces
```

**Purpose**: Provide isolation without full virtualization.

### cgroups

**Definition**: Control groups. Limit and account for resource usage.

**Resources controlled**:
- **CPU**: CPU time limits, shares
- **Memory**: Memory limits, OOM killer
- **I/O**: Disk/network bandwidth
- **Devices**: Device access control

**Example**:
```bash
# Limit container to 1 CPU core, 512 MB memory
docker run --cpus="1.0" --memory="512m" image
```

**Purpose**: Prevent one container from consuming all resources.

**cgroups v2**: Modern version with unified hierarchy.

---

## 3. Use Cases

### Virtual Machines
- Running different OSes
- Strong isolation needed
- Legacy applications
- Development/testing

### Containers
- Microservices
- Application deployment
- CI/CD pipelines
- Cloud-native applications

---

## 4. Advantages & Disadvantages

### Virtual Machines

**Advantages**:
✅ Strong isolation  
✅ Different OSes  
✅ Security (kernel bugs isolated)

**Disadvantages**:
❌ High overhead  
❌ Slow startup  
❌ Resource intensive

### Containers

**Advantages**:
✅ Fast startup  
✅ Low overhead  
✅ Efficient resource usage  
✅ Easy deployment

**Disadvantages**:
❌ Weaker isolation  
❌ Same OS only  
❌ Kernel bugs affect all

---

## 5. Best Practices

1. **Choose based on needs**: Isolation vs performance
2. **Use containers for microservices**: Fast, efficient
3. **Use VMs for strong isolation**: Security-critical
4. **Set resource limits**: cgroups for containers

---

## 6. Common Pitfalls

⚠️ **Mistake**: Thinking containers provide VM-level isolation

⚠️ **Mistake**: Not setting resource limits (cgroups)

⚠️ **Mistake**: Confusing Type 1 and Type 2 hypervisors

---

## 7. Interview Tips

**Common Questions**:
1. "Compare containers vs VMs."
2. "Why are containers faster?"
3. "What are namespaces and cgroups?"
4. "Why are containers weaker isolation?"

**Key Points**:
- Containers share kernel, VMs don't
- Containers faster (no OS boot)
- Namespaces = isolation, cgroups = resource limits
- Trade-off: Performance vs isolation

---

## 8. Related Topics

- **Security & Protection** (Topic 16): Isolation, security
- **Process Management** (Topic 5): Containers are processes

---

## 9. Visual Aids

### Container Architecture

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│Container1│  │Container2│  │Container3│
│  App     │  │  App     │  │  App     │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
     └─────────────┼─────────────┘
                   │
            ┌──────▼──────┐
            │Host Kernel  │
            │(shared)     │
            └──────┬──────┘
                   │
            ┌──────▼──────┐
            │  Hardware   │
            └─────────────┘
```

### VM Architecture

```
┌──────────┐  ┌──────────┐
│   VM 1   │  │   VM 2   │
│  Guest   │  │  Guest   │
│   OS     │  │   OS     │
└────┬─────┘  └────┬─────┘
     │             │
     └──────┬──────┘
            │
     ┌──────▼──────┐
     │ Hypervisor  │
     └──────┬──────┘
            │
     ┌──────▼──────┐
     │  Hardware   │
     └─────────────┘
```

---

## 10. Quick Reference Summary

**VM**: Complete OS on virtualized hardware

**Container**: Isolated process sharing host kernel

**Namespaces**: Isolate resources (PID, network, etc.)

**cgroups**: Limit resources (CPU, memory, I/O)

**Trade-off**: Containers = fast but weaker isolation, VMs = slow but strong isolation

